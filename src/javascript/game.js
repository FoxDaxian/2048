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

	// 画全部的方块
	drawAll () {
		for (var x = 0; x < this.count; x++) {
			for (var y = 0; y < this.count; y++) {
				if (typeof this.state[x][y] !== 'undefined') {
					this.drawBox(x, y, this.state[x][y])
				}
			}
		}
	}

	// 操作并计算重绘所有方块
	leftOperate () {
		if (this.canLeft()) {
			console.log('可以左移')
			this.moveLeft()
		}
		this.drawAll()
	}

	// 还是有bug
	// 进行左移操作
	moveLeft () {
		for (let y = 0; y < this.count; y++) {
			for (let x = 0; x < this.count; x++) {
				// 找右边不为undefined的
				let condition = this.findExist(x, y)
				if (condition !== -1) {
					const {i: tempx, y: tempy} = condition
					if (typeof this.state[x][y] === 'undefined') {
						this.state[x][y] = this.state[tempx][tempy]
						this.state[tempx][tempy] = undefined
						this.randArr.splice(y * this.count + x, 1)
						this.randArr.splice(tempy * this.count + tempx - 1, 0, tempy * this.count + tempx)
					} else {
						if (this.state[x][y] === this.state[tempx][tempy]) {
							this.state[x][y] *= 2
							this.state[tempx][tempy] = undefined
							this.randArr.splice(tempy * this.count + tempx - 1, 0, tempy * this.count + tempx)
						} else {
							if (x + 1 !== tempx) {
								this.state[x + 1][y] = this.state[tempx][tempy]
								this.state[tempx][tempy] = undefined
								this.randArr.splice(y * this.count + x + 1, 1)
								this.randArr.splice(tempy * this.count + tempx - 1, 0, tempy * this.count + tempx)
							}
						}
					}
				}
			}
		}
	}

	// 找右边不为undefined的,这个时候向左移动的时候用的
	findExist (x, y) {
		for (let i = x + 1; i < this.count; i++) {
			if (typeof this.state[i][y] !== 'undefined') {
				return {i, y}
			}
		}
		return -1
	}

	// 能不能左移，需要左移的核心逻辑
	canLeft () {
		return this.state.some((el, i) => {
			for (let j = 0; j < this.count; j++) {
				if (typeof this.state[i][j] !== 'undefined' && i > 0) {
					if (typeof this.state[i - 1][j] === 'undefined' || this.state[i - 1][j] === this.state[i][j]) {
						return true
					}
				}
			}
			return false
		})
	}

	// 判断能不能左移的核心逻辑
	judge (x, y) {
		try {
			if (typeof this.state[x - 1][y] === 'undefined' || this.state[x - 1][y] === this.state[x][y]) {
				return true
			}
			return false
		} catch (err) {
			return false
		}
	}

	// 处理键盘事件
	keyboardHandle (e) {
		const ev = e || window.event


		this.ctx.clearRect(0, 0, this.size, this.size)
		this.ctx.fillStyle = '#BBADA0'
		this.ctx.fillRect(0, 0, this.size, this.size)
		this.drawBg()



		switch (ev.keyCode) {
			case 38:
			// console.log('上')
			break;
			case 40:
			// console.log('下')
			break;
			case 37:
			console.log('左')
			// 插入init中间了
			this.leftOperate()
			break;
			case 39:
			// console.log('右')
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
