import Canvas from './Canvas.js'

// 游戏规则很简单：每次控制所有方块向同一个方向运动，两个相同数字的方块撞在一起之后合并成为他们的和，每次操作之后会在空白的方格处随机生成一个2或者4，最终得到一个“2048”的方块就算胜利了。如果16个格子全部填满并且相邻的格子都不相同也就是无法移动的话，那么恭喜你，gameover。

class Index extends Canvas{
	constructor () {
		super()
		this.count = 4
		this.boxGap = 20
		this.boxSize = (this.size - (this.count + 1) * this.boxGap) / this.count
		this.ctx = this.canvas.getContext('2d')

		// 存储状态的数组
		this.state = []
		this.initState()
		// 随机生成，防止重复
		this.randArr = []
		this.initrandArr()

		this.init()
		this.operate()

	}

	// 游戏入口
	init () {
		this.ctx.clearRect(0, 0, this.size, this.size)
		this.ctx.fillStyle = '#BBADA0'
		this.ctx.fillRect(0, 0, this.size, this.size)
		this.drawBg()

		const rand = this.randArr.splice(Math.ceil(Math.random() * this.randArr.length) - 1, 1)
		const x = rand % this.count
		const y = ~~(rand / this.count)
		this.state[x][y] = 2

		this.drawBox(x, y, 2)
	}

	// 初始化状态
	initState () {
		for (let i = 0; i++ < this.count;) {
			this.state.push([])
		}
	}

	// 初始化随机获取的总数组
	initrandArr () {
		const len = Math.pow(this.count, 2)
		for (let i = 0; i < len; i++) {
			this.randArr.push(i)
		}
	}

	// 画方块背景
	drawBg () {
		this.ctx.fillStyle = '#CDC1B4'
		this.ctx.fillRect(0 + this.boxGap, this.boxGap, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize + this.boxGap * 2, this.boxGap, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 2 + this.boxGap * 3, this.boxGap, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 3 + this.boxGap * 4, this.boxGap, this.boxSize, this.boxSize)

		this.ctx.fillRect(0 + this.boxGap, this.boxGap * 2 + this.boxSize, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize + this.boxGap * 2, this.boxGap * 2 + this.boxSize, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 2 + this.boxGap * 3, this.boxGap * 2 + this.boxSize, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 3 + this.boxGap * 4, this.boxGap * 2 + this.boxSize, this.boxSize, this.boxSize)

		this.ctx.fillRect(0 + this.boxGap, this.boxGap * 3 + this.boxSize * 2, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize + this.boxGap * 2, this.boxGap * 3 + this.boxSize * 2, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 2 + this.boxGap * 3, this.boxGap * 3 + this.boxSize * 2, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 3 + this.boxGap * 4, this.boxGap * 3 + this.boxSize * 2, this.boxSize, this.boxSize)

		this.ctx.fillRect(0 + this.boxGap, this.boxGap * 4 + this.boxSize * 3, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize + this.boxGap * 2, this.boxGap * 4 + this.boxSize * 3, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 2 + this.boxGap * 3, this.boxGap * 4 + this.boxSize * 3, this.boxSize, this.boxSize)
		this.ctx.fillRect(this.boxSize * 3 + this.boxGap * 4, this.boxGap * 4 + this.boxSize * 3, this.boxSize, this.boxSize)
	}

	// 画一个随机的方块
	drawBox (x, y, num) {
		// X 坐标 i : 0 -> 3
		// this.ctx.fillRect((w * i) + this.boxGap * (i + 1), this.boxGap, w, w)
		// Y 坐标 j : 0 -> 3
		// this.ctx.fillRect(this.boxGap, (w * j) + this.boxGap * (j + 1), w, w)

		const realX = (this.boxSize * x) + this.boxGap * (x + 1)
		const realY = (this.boxSize * y) + this.boxGap * (y + 1)

		this.ctx.fillStyle = '#EEE4DA'
		this.ctx.fillRect(realX, realY, this.boxSize, this.boxSize)

		this.ctx.save()
		this.ctx.fillStyle = 'red'
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline = 'middle'
		this.ctx.font = '30px sans-serif'
		this.ctx.fillText(num, realX + this.boxSize / 2, realY + this.boxSize / 2)
		this.ctx.restore()
	}

	// 动画
	animate (x, y, num) {

		const realX = (this.boxSize * x) + this.boxGap * (x + 1)
		const realY = (this.boxSize * y) + this.boxGap * (y + 1)

		this.ctx.fillStyle = '#EEE4DA'
		this.ctx.fillRect(realX, realY, this.boxSize, this.boxSize)

		this.ctx.save()
		this.ctx.fillStyle = 'red'
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline = 'middle'
		this.ctx.font = '30px sans-serif'
		this.ctx.fillText(num, realX + this.boxSize / 2, realY + this.boxSize / 2)
		this.ctx.restore()
	}

	// 画所有的方块
	animateAll () {
		for (let y = 0; y < this.count; y++) {
			for (let x = 0; x < this.count; x++) {
				
			}
		}
	}

	// 处理键盘事件
	keyboardHandle (e) {
		const ev = e || window.event


		this.ctx.clearRect(0, 0, this.size, this.size)
		this.ctx.fillStyle = '#BBADA0'
		this.ctx.fillRect(0, 0, this.size, this.size)
		this.drawBg()

		// 插入init中间了
		this.animateAll()


		switch (ev.keyCode) {
			case 38:
			console.log('上')
			break;
			case 40:
			console.log('下')
			break;
			case 37:
			console.log('左')
			break;
			case 39:
			console.log('右')
			break;
		}


		// 再随机生成一个
		const rand = this.randArr.splice(Math.ceil(Math.random() * this.randArr.length) - 1, 1)
		if (rand.length) {
			const x = rand % this.count
			const y = ~~(rand / this.count)
			this.state[x][y] = 2
			this.drawBox(x, y, 2)
		}
	}

	operate () {
		canvas.addEventListener('keydown', this.keyboardHandle.bind(this))
	}
}

export default Index
