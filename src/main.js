import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import filter from "./filter";
//vuex
import store from "./store";

import "./resetui.scss";
import "postcss-pxtorem";
import "./config/rem";

import defaultIMG from "@/assets/defaultImg.png";
import { Lazyload } from "vant";

import Meta from "vue-meta";
Vue.use(Meta);

Vue.use(Lazyload, {
  preLoad: 1.3,
  error: defaultIMG,
  loading: defaultIMG,
  attempt: 3,
});
import {
  Col,
  Row,
  Toast,
  Button,
  Skeleton,
  Swipe,
  SwipeItem,
  Cell,
  CellGroup,
  Icon,
  Popup,
  Dialog,
  Tab,
  Tabs,
  Image,
  Loading,
  Search,
  Field,
  List,
  ActionSheet,
  Empty,
  Step,
  Steps,
  Tabbar,
  TabbarItem,
  Sidebar,
  Picker,
  Uploader,
  SidebarItem,
  PullRefresh,
  Overlay,
  Switch,
  DatetimePicker,
  Grid,
  GridItem,
  Badge,
  Stepper,
  RadioGroup,
  Radio,
} from "vant";

Toast.setDefaultOptions({
  forbidClick: true,
});
Toast.setDefaultOptions("loading", {
  forbidClick: true,
  duration: 0,
});

Vue.use(Loading)
  .use(Col)
  .use(Row)
  .use(Toast)
  .use(Button)
  .use(Skeleton)
  .use(Swipe)
  .use(SwipeItem)
  .use(Cell)
  .use(CellGroup)
  .use(Icon)
  .use(Popup)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Image)
  .use(Search)
  .use(Field)
  .use(List)
  .use(Empty)
  .use(ActionSheet)
  .use(Step)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Picker)
  .use(Uploader)
  .use(PullRefresh)
  .use(Overlay)
  .use(Switch)
  .use(DatetimePicker)
  .use(Grid)
  .use(GridItem)
  .use(Badge)
  .use(Stepper)
  .use(RadioGroup)
  .use(Radio)
  .use(Steps);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
