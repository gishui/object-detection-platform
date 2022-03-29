import Vue from 'vue'
import {
    Button,
    Input,Form,FormItem,Message,Container,
    Header,Aside,Main,Menu,MenuItem,Submenu,
    Breadcrumb,BreadcrumbItem,Card,Row,Col,
    Table,TableColumn,Switch,Tooltip,Pagination,
    Upload,Image,Carousel,CarouselItem,Divider,Notification} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Upload)
Vue.use(Image)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Divider)

Vue.prototype.$message=Message
Vue.prototype.$notify=Notification

