/// <reference types="zepto" />

declare namespace CMUI {

	// 此属性暂未实现
	// export const VERSION: string

	// 此方法不是公开接口
	// export function init(): void

	type elem = string | Element | ZeptoCollection

	////////////////////  mask  ////////////////////
	interface IMask {
		show: () => void
		hide: () => void
		fadeIn: () => void
		fadeOut: () => void
		get$Element: () => ZeptoCollection
	}
	export const mask: IMask

	////////////////////  loading  ////////////////////
	interface ILoading {
		show: (options: loadingShowOptions) => void
		hide: () => void
		fadeIn: (options: loadingShowOptions) => void
		fadeOut: () => void
		updateText: (text: string) => void
	}
	type loadingShowOptions = string
	export const loading: ILoading

	////////////////////  dialog  ////////////////////
	interface IDialog {
		create: (config: IDialogCreateConfig) => void
		hide: () => void
		show: (elem: elem, options?: IDialogShowOptions) => void
	}
	interface IDialogCreateConfig {
		tag?: string
		id?: string
		img?: string | IDialogImgConfig
		title?: string
		content?: string
		btn?: {
			primary?: IDialogBtnConfig
			minor?: IDialogBtnConfig
		}
	}
	interface IDialogImgConfig {
		url: string
		width?: number
		height?: number
	}
	interface IDialogBtnConfig {
		tag?: 'button' | 'a'
		innerHTML?: string
		link?: string
		className?: string | string[]
		action?: string
		canHideDialog?: boolean
	}
	interface IDialogShowOptions {
		autoHideDelay?: number
	}
	export const dialog: IDialog

	////////////////////  panel  ////////////////////
	interface IPanel {
		show: (elem: elem, options?: IPanelOptions) => void
		hide: (options) => void
		switchTo: (elem: elem, options?: IPanelOptions) => void
		switchBack: (options) => void
	}
	interface IPanelOptions {
		duration?: number
		height?: number | string
		callback?: Function
	}
	export const panel: IPanel

	////////////////////  scrollBox  ////////////////////
	interface IScrollBox {
		refresh: () => void
	}
	export const scrollBox: IScrollBox


}
