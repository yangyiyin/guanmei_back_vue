webpackJsonp([34],{111:function(n,t){},114:function(n,t){n.exports={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"fillcontain",attrs:{id:"app"}},[n.percentage?e("el-progress",{staticStyle:{position:"absolute",top:"0px",left:"0px","z-index":"999",width:"100%"},attrs:{percentage:n.percentage,"show-text":!1}}):n._e(),n._v(" "),e("router-view")],1)},staticRenderFns:[]}},21:function(n,t){n.exports=Vue},34:function(n,t,e){"use strict";var r=e(21),o=e.n(r),c=e(66),u=(e(62),e(68));o.a.use(c.a);var a={constant:u.a,adminInfo:{avatar:"default.jpg"},percentage:0},i={saveAdminInfo:function(n,t){n.adminInfo=t},set_percentage:function(n,t){n.percentage=t},add_percentage:function(n,t){var t=n.percentage+parseInt(t);t>=99&&(t=99),n.percentage=t}},p={};t.a=new c.a.Store({state:a,actions:p,mutations:i})},35:function(n,t,e){"use strict";var r=e(21),o=e.n(r),c=e(115);o.a.use(c.a);var u=function(n){return e.e(31).then(function(){return n(e(120))}.bind(null,e)).catch(e.oe)},a=function(n){return e.e(32).then(function(){return n(e(121))}.bind(null,e)).catch(e.oe)},i=function(n){return e.e(30).then(function(){return n(e(119))}.bind(null,e)).catch(e.oe)},p=function(n){return e.e(29).then(function(){return n(e(122))}.bind(null,e)).catch(e.oe)},d=function(n){return e.e(19).then(function(){return n(e(140))}.bind(null,e)).catch(e.oe)},s=function(n){return e.e(20).then(function(){return n(e(138))}.bind(null,e)).catch(e.oe)},f=function(n){return e.e(25).then(function(){return n(e(126))}.bind(null,e)).catch(e.oe)},h=function(n){return e.e(24).then(function(){return n(e(134))}.bind(null,e)).catch(e.oe)},l=function(n){return e.e(28).then(function(){return n(e(123))}.bind(null,e)).catch(e.oe)},m=function(n){return e.e(21).then(function(){return n(e(137))}.bind(null,e)).catch(e.oe)},g=function(n){return e.e(26).then(function(){return n(e(125))}.bind(null,e)).catch(e.oe)},b=function(n){return e.e(18).then(function(){return n(e(141))}.bind(null,e)).catch(e.oe)},_=function(n){return e.e(23).then(function(){return n(e(135))}.bind(null,e)).catch(e.oe)},v=function(n){return e.e(22).then(function(){return n(e(136))}.bind(null,e)).catch(e.oe)},w=function(n){return e.e(27).then(function(){return n(e(124))}.bind(null,e)).catch(e.oe)},x=function(n){return e.e(16).then(function(){return n(e(139))}.bind(null,e)).catch(e.oe)},y=function(n){return e.e(17).then(function(){return n(e(127))}.bind(null,e)).catch(e.oe)},j=function(n){return e.e(13).then(function(){return n(e(148))}.bind(null,e)).catch(e.oe)},I=function(n){return e.e(5).then(function(){return n(e(131))}.bind(null,e)).catch(e.oe)},O=function(n){return e.e(10).then(function(){return n(e(147))}.bind(null,e)).catch(e.oe)},S=function(n){return e.e(0).then(function(){return n(e(130))}.bind(null,e)).catch(e.oe)},k=function(n){return e.e(14).then(function(){return n(e(142))}.bind(null,e)).catch(e.oe)},E=function(n){return e.e(15).then(function(){return n(e(128))}.bind(null,e)).catch(e.oe)},T=function(n){return e.e(8).then(function(){return n(e(143))}.bind(null,e)).catch(e.oe)},M=function(n){return e.e(7).then(function(){return n(e(144))}.bind(null,e)).catch(e.oe)},P=function(n){return e.e(9).then(function(){return n(e(145))}.bind(null,e)).catch(e.oe)},A=function(n){return e.e(1).then(function(){return n(e(151))}.bind(null,e)).catch(e.oe)},L=function(n){return e.e(11).then(function(){return n(e(150))}.bind(null,e)).catch(e.oe)},q=function(n){return e.e(3).then(function(){return n(e(133))}.bind(null,e)).catch(e.oe)},z=function(n){return e.e(6).then(function(){return n(e(146))}.bind(null,e)).catch(e.oe)},C=function(n){return e.e(2).then(function(){return n(e(129))}.bind(null,e)).catch(e.oe)},R=function(n){return e.e(12).then(function(){return n(e(149))}.bind(null,e)).catch(e.oe)},$=function(n){return e.e(4).then(function(){return n(e(132))}.bind(null,e)).catch(e.oe)},H=[{path:"/",component:u},{path:"/manage",component:a,name:"",children:[{path:"/",component:p,meta:["首页",""]},{path:"/error",component:i,meta:["错误","错误"]},{path:"/config",component:d,meta:["设置","参数配置"]},{path:"/admin_user",component:s,meta:["后台管理","用户管理"]},{path:"/add_admin_user",component:f,meta:["后台管理","添加用户"]},{path:"/admin_group",component:h,meta:["后台管理","组管理"]},{path:"/add_admin_group",component:l,meta:["后台管理","添加组"]},{path:"/admin_orgnize",component:v,meta:["后台管理","部门管理"]},{path:"/add_admin_orgnize",component:w,meta:["后台管理","添加部门"]},{path:"/admin_purview",component:m,meta:["系统","权限管理"]},{path:"/add_admin_purview",component:g,meta:["系统","添加权限"]},{path:"/admin_log",component:_,meta:["系统","用户操作日志"]},{path:"/group_purview",component:b,meta:["后台管理","权限组权限"]},{path:"/color",component:x,meta:["设置","颜色"]},{path:"/add_color",component:y,meta:["设置","设置颜色"]},{path:"/product_category",component:j,meta:["设置","帽子种类管理"]},{path:"/add_product_category",component:I,meta:["设置","设置帽子种类"]},{path:"/product",component:O,meta:["设置","帽子型号管理"]},{path:"/add_product",component:S,meta:["设置","设置帽子型号"]},{path:"/process",component:k,meta:["设置","流程管理"]},{path:"/add_process",component:E,meta:["设置","设置流程"]},{path:"/process_produce_order",component:T,meta:["交接单","订单交接"]},{path:"/process_saoyisao",component:M,meta:["交接单","扫码交接"]},{path:"/process_survey",component:P,meta:["流程概况","概况"]},{path:"/storage_produce_order",component:A,meta:["仓库","生产单管理"]},{path:"/storage",component:L,meta:["仓库","库存管理"]},{path:"/add_storage",component:q,meta:["仓库","设置库存"]},{path:"/produce_order",component:z,meta:["生产单","生产单管理"]},{path:"/add_produce_order",component:C,meta:["生产单","设置生产单"]},{path:"/sales_order",component:R,meta:["业务单","业务单管理"]},{path:"/add_sales_order",component:$,meta:["业务单","设置业务单"]}]}];t.a=new c.a({routes:H,strict:!1})},38:function(n,t,e){"use strict";e.d(t,"a",function(){return r}),e.d(t,"b",function(){return o});var r="",o=void 0;r="//api.yixsu.com/index.php",o="//elm.cangdu.org/img/"},57:function(n,t,e){e(111);var r=e(60)(e(70),e(114),null,null);n.exports=r.exports},58:function(n,t){n.exports=ELEMENT},59:function(n,t,e){"use strict";e.d(t,"b",function(){return i}),e.d(t,"a",function(){return p}),e.d(t,"e",function(){return d}),e.d(t,"d",function(){return s}),e.d(t,"c",function(){return f});var r=e(23),o=e.n(r),c=e(40),u=(e.n(c),e(39)),a=e.n(u),i=function(n,t){n&&("string"!=typeof t&&(t=a()(t)),window.localStorage.setItem(n,t))},p=function(n){if(n)return window.localStorage.getItem(n)},d=function(n){n&&window.localStorage.removeItem(n)},s=function(n){return new o.a(function(t,e){999==n.code?router.push("/"):t(n)})},f=function(n){var t="image/jpeg"===n.type||"image/png"===n.type,e=n.size/1024/1024<1;return t||(this.fullscreenLoading=!1,this.$message.error("图片格式只支持jpg和png!")),e||(this.fullscreenLoading=!1,this.$message.error("图片大小不能超过 1MB!")),e}},61:function(n,t,e){"use strict";var r=e(64),o=e.n(r),c=e(67),u=e.n(c),a=e(23),i=e.n(a),p=e(39),d=e.n(p),s=e(40),f=e.n(s),h=e(63),l=e.n(h),m=e(38),g=e(59),b=e(34),_=this;t.a=function(){var n=l()(o.a.mark(function n(){var t,r,c,a,p,s,h=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},v=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",w=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"fetch";return o.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(v=v.toUpperCase(),-1==h.indexOf("//")&&(h=m.a+h),"GET"==v&&(t="",f()(l).forEach(function(n){t+=n+"="+l[n]+"&"}),""!==t&&(t=t.substr(0,t.lastIndexOf("&")),h=h+"?"+t)),!window.fetch||"fetch"!=w){n.next=26;break}return r={method:v,headers:{Accept:"application/json","Content-Type":"application/json"},mode:"cors",cache:"force-cache"},"POST"==v&&(l=l||{},l.token=e.i(g.a)("token")?e.i(g.a)("token"):"",Object.defineProperty(r,"body",{value:d()(l)})),n.prev=6,b.a.commit("set_percentage",2),c=0,a=setInterval(function(){c>100&&a&&clearInterval(a),b.a.commit("add_percentage",1),c++},50),n.next=12,fetch(h,r);case 12:return p=n.sent,n.next=15,p.json();case 15:return s=n.sent,a&&clearInterval(a),b.a.commit("set_percentage",0),n.abrupt("return",s);case 21:throw n.prev=21,n.t0=n.catch(6),new Error(n.t0);case 24:n.next=27;break;case 26:return n.abrupt("return",new i.a(function(n,t){var e=void 0;e=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject;var r="";"POST"==v&&(r=d()(l)),e.open(v,h,!0),e.setRequestHeader("Content-type","application/json"),e.send(r),e.onreadystatechange=function(){if(4==e.readyState)if(200==e.status){var r=e.response;"object"!==(void 0===r?"undefined":u()(r))&&(r=JSON.parse(r)),n(r)}else t(e)}}));case 27:case"end":return n.stop()}},n,_,[[6,21]])}));return function(){return n.apply(this,arguments)}}()},62:function(n,t,e){"use strict";e.d(t,"a",function(){return o});var r=e(61),o=function(n){return e.i(r.a)("/guanmei/admin/login",n,"POST")}},68:function(n,t,e){"use strict";var r=e(38);t.a={status_success:100,upload_url:r.a+"/waibao/common/qiniu_upload?bucket=guanmei"}},69:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=e(21),o=e.n(r),c=e(57),u=e.n(c),a=e(35),i=e(34),p=e(58),d=e.n(p);o.a.config.productionTip=!1,o.a.use(d.a),new o.a({el:"#app",router:a.a,store:i.a,template:"<App/>",components:{App:u.a}})},70:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={computed:{percentage:function(){return this.$store.state.percentage}}}}},[69]);