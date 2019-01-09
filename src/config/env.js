/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = "";
let routerMode = "hash";
let baseImgPath;

// 改
if (process.env.NODE_ENV == "development") {
    // baseUrl = "//api.yixsu.com/index.php"; // 线上地址
    // baseUrl = '//www.myweb.com/git-res/earth_php/index.php';  // 本地接口地址
    baseUrl = "//api.88plus.net/index.php"; // 测试接口地址
    baseImgPath = "/img/";
} else {
    baseUrl = "//api.yixsu.com/index.php"; // 线上地址
    baseImgPath = "//elm.cangdu.org/img/";
}

export { baseUrl, routerMode, baseImgPath };
