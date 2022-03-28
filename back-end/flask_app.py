from models.experimental import attempt_load
from utils.torch_utils import select_device
from PIL import Image
import logging as rel_log
import base64
import io
from flask import Flask, request, jsonify
import json
import numpy as np
from predict import predict
from pathlib import Path
from flask_cors import *
import os
import shutil
 
app = Flask(__name__,static_folder="./static/output")
CORS(app, supports_credentials=True)

werkzeug_logger = rel_log.getLogger('werkzeug')
werkzeug_logger.setLevel(rel_log.ERROR)

# 读取flask配置
with open('./flask_config.json','r',encoding='utf8')as fp:
    opt = json.load(fp)
    print('Flask Config : ', opt)

# 选择设备
device = select_device(opt['device'])
# 加载模型
model = attempt_load(opt['weights'], map_location=device)  

@app.after_request
def add_headers(response):
    # 允许跨域
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST'
    response.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return response

@app.route('/predict/', methods=['POST','GET'],strict_slashes=False)
# 响应POST消息的预测函数
def get_prediction():
    response = request.get_json()
    data_str = response['image']
    point = data_str.find(',')
    base64_str = data_str[point:]  # remove unused part like this: "data:image/jpeg;base64,"
    image = base64.b64decode(base64_str) # base64图像解码
    img = Image.open(io.BytesIO(image)) # 打开文件
    if (img.mode != 'RGB'):
        img = img.convert("RGB")
    save_path = str(Path(opt['source']) / Path("source_image.jpg")) # 保存路径
    img.save(save_path) # 保存文件
    #img.save("./static/image/img4predict.jpg")  

    # convert to numpy array.
    img_arr = np.array(img)
    # print('img_arr shape = %s \n' % str(img_arr.shape))
    results = predict(opt, model, img_arr) # 预测图像

    with open('static/output/dectect_image.jpg', 'rb') as img_f:
        img_stream = base64.b64encode(img_f.read())
        dectect_image= img_stream.decode()
    
    return jsonify({'data':results,'image_url': dectect_image})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')
    #app.run(debug=False, host='127.0.0.1')



