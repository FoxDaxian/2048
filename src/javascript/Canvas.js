class Canvas {
	constructor () {
		// canvas 元素
		this.canvas = null
		// canvas 画布大小
		this.size = 0
		// 生成canvas，初始化
		this.initCanvas()
	}

	initCanvas () {
		this.size = this.getSize()
		const canvas = `<canvas id='canvas' width='${ this.size }' height='${ this.size }' style='position: fixed; top: 0; left: 0; right: 0; bottom: 0; margin: auto;' tabindex=0></canvas>`
		const teompNode = document.createElement('div')
		teompNode.innerHTML = canvas
		this.canvas = teompNode.childNodes[0]
		document.body.appendChild(this.canvas)
	}

	getSize () {
		let width, height

    	// 获取窗口宽度
    	if (window.innerWidth)
    		width = window.innerWidth
    	else if ((document.body) && (document.body.clientWidth))
    		width = document.body.clientWidth

    	if (window.innerHeight)
    		height = window.innerHeight
    	else if ((document.body) && (document.body.clientHeight))
    		height = document.body.clientHeight

    	// 通过深入 Document 内部对 body 进行检测，获取窗口大小
    	if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    		width = document.documentElement.clientWidth
    		height = document.documentElement.clientHeight
    	}
    	return Math.min(width, height) * 0.8
    }
}

export default Canvas
