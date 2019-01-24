/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = ''; 
let routerMode = 'hash';
let baseImgPath;

if (process.env.NODE_ENV == 'development') {
	// baseUrl = '//www.myweb.com/git-res/earth_php/index.php';
	baseUrl = '//api.88plus.net/index.php';
    baseImgPath = '/img/';
}
else if (process.env.NODE_ENV == 'local') {
    baseUrl = '//www.myweb.com/git-res/earth_php/index.php';
    baseImgPath = '/img/';
}
else{
	baseUrl = '//api.yixsu.com/index.php';
    baseImgPath = '//elm.cangdu.org/img/';
}

export {
	baseUrl,
	routerMode,
	baseImgPath
}