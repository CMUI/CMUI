# CMUI

> A **Crude Mobile UI** framework.  
> 一个简单粗暴的移动端 Web UI 框架。

CMUI 是一个专攻移动网页的 UI 框架，它提供了丰富的组件和简洁的接口，开箱即用。CMUI 帮助开发者摆脱样式细节和兼容性困扰，从而腾出更多精力投入到业务开发中。

## 兼容性

#### 浏览器支持

* 支持以下移动平台的主流浏览器：
	* iOS 7+
	* Android 4+

* 同样支持以下桌面浏览器：
	* Firefox (edge)
	* Chrome (edge)
	* Safari (edge)

（更多细节参见 [CMUI 的浏览器分级支持策略](https://github.com/CMUI/doc/issues/2)。）

#### 外部依赖

* Underscore 1.6+
* Zepto 1.1+
* Gearbox 0.4+

## 安装

0. 通过 Bower 安装：

	```sh
	$ bower install cmui
	```

0. 在页面中加载 CMUI 的样式文件、脚本文件及必要的依赖：

	```html
	<!DOCTYPE html>
	<html>
	<head>
		...
		<link rel="stylesheet" href="bower_components/cmui/dist/cmui.css">
	</head>
	<body>
		...
		<script src="bower_components/underscore/underscore-min.js"></script>
		<script src="bower_components/zepto.js/dist/zepto.min.js"></script>
		<script src="bower_components/gearbox/dist/gearbox.min.js"></script>
		<script src="bower_components/cmui/dist/cmui.js"></script>
	</body>
	</html>
	```

## 演示

建议使用 iOS/Android 设备访问：[CMUI Demo](http://cmui.net/)

![cmui-demo](https://cloud.githubusercontent.com/assets/1231359/5896609/594d6914-a573-11e4-8dcf-8bc1378593be.png)

## 谁在用？

以下案例基于 CMUI v0.10 构建（建议使用 iOS/Android 设备访问）：

* [百姓网 - 手机版](http://m.baixing.com/)

以下案例基于 CMUI v0.8 构建（建议使用 iOS/Android 设备访问）：

* [优e网 - 手机版](http://m.uemall.com/)
* [薇姿官方电子商城 - 手机版](http://m.vichy.com.cn/)

***

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
