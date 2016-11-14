# CMUI

> CMUI is a UI framework for mobile web. It provides rich widgets and simple interfaces out-of-the-box, which helps developers get ride of details of styling and troubles of compatibility, and focus on building their own applications.

CMUI 是一个专攻移动网页的 UI 框架，它提供了丰富的组件和简洁的接口，开箱即用。CMUI 帮助开发者摆脱样式细节和兼容性困扰，从而腾出更多精力投入到业务开发中。

## 兼容性

#### 浏览器支持

* 支持以下移动平台的主流浏览器：
	* iOS 7+
	* Android 4+

* 同样支持以下桌面浏览器：
	* Firefox (Latest)
	* Chrome (Latest)
	* Safari (Latest)

（更多细节参见 [CMUI 的浏览器分级支持策略](https://github.com/CMUI/doc/issues/2)。）

#### 外部依赖

* Underscore 1.6+
* Zepto 1.1+
* Gearbox 0.6+

## 安装与使用

> CMUI v2 仍在 beta 阶段，以下步骤可能无法工作。

#### 传统方式

0. 通过 npm 3 安装：

	```sh
	$ npm install cmui
	```

0. 在页面中加载 CMUI 的样式文件、脚本文件及必要的依赖：

	```html
	<!DOCTYPE html>
	<html>
	<head>
		...
		<link rel="stylesheet" href="node_modules/cmui/dist/cmui.css">
	</head>
	<body>
		...
		<script src="node_modules/underscore/underscore-min.js"></script>
		<script src="node_modules/zepto.js/dist/zepto.min.js"></script>
		<script src="node_modules/cmui-gearbox/dist/gearbox.min.js"></script>
		<script src="node_modules/cmui/dist/cmui.js"></script>
	</body>
	</html>
	```

#### 通过 Stylus 加载

如果你的项目以 [Stylus](http://stylus-lang.com/) 作为 CSS 预处理器语言，则可以在你的源码中直接引入 CMUI 的样式入口文件：

```stylus
@import './node_modules/cmui/src/css/theme/baixing/index'
```

在这种方式下，你可以在源码中使用 [CMUI 提供的高级 API](http://cmui.net/demo/v2/theme/baixing/api.php)：

* 变量
* Mixin

## 演示与文档

建议使用 iOS/Android 设备访问：[CMUI Demo](http://cmui.net/)

![cmui-demo](https://cloud.githubusercontent.com/assets/1231359/5896609/594d6914-a573-11e4-8dcf-8bc1378593be.png)

## 谁在用？

以下案例基于 CMUI v2 构建（请使用 iOS/Android 设备访问）：

* [百姓网 - 手机版 (m.baixing.com)](http://m.baixing.com/)

以下案例基于 CMUI v0.8 构建（建议使用 iOS/Android 设备访问）：

* [优e网 - 手机版 (m.uemall.com)](http://m.uemall.com/)
* [薇姿官方电子商城 - 手机版 (m.vichy.com.cn)](http://m.vichy.com.cn/)

***

## Thanks

CMUI is based on these open source projects:

* [Normalize.css](https://github.com/necolas/normalize.css)
* [Zero](https://github.com/CMUI/zero)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
