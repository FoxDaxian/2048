import Canvas from './Canvas.js'
import colors from '../config/color.js'

class Game extends Canvas{
	constructor () {
		super()
		this.score = 0
		this.playing = false
		this.count = 4
		this.boxGap = 20
		this.forScoreSize = this.size * 0.8
		this.canvasSpace = this.size * 0.1
		this.boxSize = (this.forScoreSize - (this.count + 1) * this.boxGap) / this.count
		this.ctx = this.canvas.getContext('2d')
		// 存储状态的数组
		this.state = []
		// 随机生成，防止重复
		this.randArr = []

		this.bindEvent()
	}

	// 开始界面
	init () {
		this.canvas.addEventListener('click', () => {
			if (!this.playing) {
				this.start()
				this.playing = !this.playing
			}
		})
		this.ctx.fillStyle = colors.scoreColor
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline = 'middle'
		this.ctx.font = '30px sans-serif'
		this.ctx.fillText('click to start', this.size / 2, this.size / 2)
	}

	// 游戏开始
	start () {
		console.log('开始')
		// init状态
		this.initrandArr()
		this.initState()

		this.preOperate()
		this.drawScore()
		this.randProdBox()
	}

	// 游戏结束
	gameOver () { 
		this.ctx.save()
		this.ctx.fillStyle = colors.scoreColor
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline = 'middle'
		this.ctx.font = '30px sans-serif'
		this.ctx.fillText(`游戏结束，您的分数: ${ this.score }`, this.size / 2, this.size / 2)
		this.ctx.fillText(`点击重玩`, this.size / 2, this.size / 2 + 50)
		this.ctx.restore()

		// 存储状态的数组
		this.state = []
		// 随机生成，防止重复
		this.randArr = []
		this.playing = !this.playing
		this.score = 0
	}

	// 初始化二位数组状态
	initState () {
		for (let i = 0; i++ < this.count;) {
			this.state.push(new Array(4).fill(undefined))
		}
	}

	// 初始化随机获取的总数组
	initrandArr () {
		const len = Math.pow(this.count, 2)
		for (let i = 0; i < len; i++) {
			this.randArr.push(i)
		}
	}

	// 初始化和重绘之前的操作
	preOperate () {
		this.ctx.clearRect(0, 0, this.size, this.size)
		this.drawBg()
		this.drawBoxBg()
	}

	// 分数显示
	drawScore (score = 0) {
		this.ctx.save()
		this.score += score
		this.ctx.fillStyle = colors.scoreColor
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline = 'middle'
		this.ctx.font = '30px sans-serif'
		this.ctx.fillText(`SCORE: ${ this.score }`, this.size / 2, this.canvasSpace)
		this.ctx.restore()
	}

	// 画大背景
	drawBg () {
		this.ctx.fillStyle = colors.bg
		this.ctx.fillRect(this.canvasSpace, this.canvasSpace * 2, this.forScoreSize, this.forScoreSize)
	}

	// 画方块槽
	drawBoxBg () {
		this.ctx.fillStyle = colors.boxBg
		const getX = (index) => this.boxSize * index + this.boxGap * (index + 1) + this.canvasSpace
		const getY = (y) => this.boxGap * (y + 1) + this.boxSize * y + this.canvasSpace * 2
		for (let y = 0; y < this.count; y++) {
			let index = 0
			this.ctx.fillRect(getX(index++), getY(y), this.boxSize, this.boxSize)
			this.ctx.fillRect(getX(index++), getY(y), this.boxSize, this.boxSize)
			this.ctx.fillRect(getX(index++), getY(y), this.boxSize, this.boxSize)
			this.ctx.fillRect(getX(index++), getY(y), this.boxSize, this.boxSize)
		}
	}

	// 画一个随机的方块
	drawRandomBox (x, y, num) {

		const realX = (this.boxSize * x) + this.boxGap * (x + 1) + this.canvasSpace
		const realY = (this.boxSize * y) + this.boxGap * (y + 1) + this.canvasSpace * 2

		this.ctx.fillStyle = colors[num]
		this.ctx.fillRect(realX, realY, this.boxSize, this.boxSize)

		this.ctx.save()
		this.ctx.fillStyle = colors.fontColor
		this.ctx.textAlign = 'center'
		this.ctx.textBaseline = 'middle'
		this.ctx.font = '30px sans-serif'
		this.ctx.fillText(num, realX + this.boxSize / 2, realY + this.boxSize / 2)
		this.ctx.restore()
	}

	// 画操作之后的所有方块，对应state
	drawAll () {
		// 扁平化数组, const + apply 是效率高的一组配合
		const arr = [].concat.apply([], this.state)

		arr.map((num, index) => {
			if (typeof num !== 'undefined') {
				const x = ~~(index / this.count)
				const y = index % this.count
				this.drawRandomBox(x, y, this.state[x][y])
			}
		})
	}

	// 随机生成一个方块坐标
	randProdBox () {
		const rand = this.randArr.splice(Math.ceil(Math.random() * this.randArr.length) - 1, 1)
		if (rand.length) {
			const num = Math.random() > 0.5 ? 2 : 4
			const x = rand % this.count
			const y = ~~(rand / this.count)
			this.state[x][y] = num
			this.drawRandomBox(x, y, num)
		}
	}

	// 操作并计算重绘所有方块
	operate (dir) {
		const flag = this.hasMove(dir)
		if (flag) {
			this.preOperate()
			this.drawScore(this.justMove(dir))
			this.drawAll()
			// 再随机生成一个
			this.randProdBox()
			if (!this.hasMove(1) && !this.hasMove(2) && !this.hasMove(3) && !this.hasMove(4)) {
				console.log('游戏结束')
				this.gameOver()
			}
		}
	}

	// 进行移动操作
	justMove (dir) {
		let score = 0
		// 操作过了
		const operated = (x, y, tempx, tempy) => {
			if (typeof this.state[x][y] === 'undefined') {
				this.state[x][y] = this.state[tempx][tempy]
				this.state[tempx][tempy] = undefined

				
				this.delFromRandArr(y * this.count + x, this.randArr)
				this.insetToRandArr(tempy * this.count + tempx, this.randArr)
				return true
			} else {
				if (this.state[x][y] === this.state[tempx][tempy]) {
					score = this.state[x][y] *= 2
					this.state[tempx][tempy] = undefined

					this.insetToRandArr(tempy * this.count + tempx, this.randArr)
					// 这个return true不能要，不然会造成：4 2 2 -> 8 
					// 正确的是：4 2 2 -> 4 4
				} else {
					switch (dir) {
						case 1:
						if (x + 1 !== tempx) {
							// 左
							this.state[x + 1][y] = this.state[tempx][tempy]
							this.state[tempx][tempy] = undefined
							this.delFromRandArr(y * this.count + x + 1, this.randArr)
							this.insetToRandArr(tempy * this.count + tempx, this.randArr)
							return true
						}
						break;
						case 2:
						if (x - 1 !== tempx) {
							// 右
							this.state[x - 1][y] = this.state[tempx][tempy]
							this.state[tempx][tempy] = undefined
							this.delFromRandArr(y * this.count + x - 1, this.randArr)
							this.insetToRandArr(tempy * this.count + tempx, this.randArr)
							return true
						}
						break;
						case 3:
						if (y + 1 !== tempy) {
							// 上
							this.state[x][y + 1] = this.state[tempx][tempy]
							this.state[tempx][tempy] = undefined
							this.delFromRandArr((y + 1) * this.count + x, this.randArr)
							this.insetToRandArr(tempy * this.count + tempx, this.randArr)
							return true
						}
						break;
						case 4:
						if (y - 1 !== tempy) {
							// 下
							this.state[x][y - 1] = this.state[tempx][tempy]
							this.state[tempx][tempy] = undefined
							this.delFromRandArr((y - 1) * this.count + x, this.randArr)
							this.insetToRandArr(tempy * this.count + tempx, this.randArr)
							return true
						}
						break;
					}
				}
			}
		}

		const canMove = (x, y) => {
			let condition = this.findExist(x, y, dir)

			if (condition !== -1) {
				const {x: tempx, y: tempy} = condition
				if (operated(x, y, tempx, tempy)) {
					return true
				}
			}
		}

		switch (dir) {
			// 左
			case 1:
			for (let y = 0; y < this.count; y++) {
				for (let x = 0; x < this.count; x++) {
					canMove(x, y) && x--
				}
			}
			break;
			// 右
			case 2:
			for (let y = 0; y < this.count; y++) {
				for (let x = this.count - 1; x > -1; x--) {
					canMove(x, y) && x++
				}
			}
			break;
			// 上
			case 3:
			for (let x = 0; x < this.count; x++) {
				for (let y = 0; y < this.count; y++) {
					canMove(x, y) && y--
				}
			}
			break;
			// 下
			case 4:
			for (let x = 0; x < this.count; x++) {
				for (let y = this.count - 1; y > -1; y--) {
					canMove(x, y) && y++
				}
			}
			break;
		}
		return score
	}

	// 在randArr插入一个
	insetToRandArr (num, arr) {
		const i = arr.findIndex((value) => {
			return value > num
		})
		arr.splice(i, 0, num)
	}

	// 从randArr中删除一个
	delFromRandArr (num, arr) {
		const i = arr.findIndex(function(value) {
			return value === num
		})
		arr.splice(i, 1)
	}

	// 找任意一排中存在的值
	findExist (x, y, dir) {
		switch (dir) {
			// 左
			case 1:
			if (x === this.count - 1) {
				return -1
			}
			for (let i = x + 1; i < this.count; i++) {
				if (typeof this.state[i][y] !== 'undefined') {
					return {
						x: i,
						y
					}
				}
			}
			break;
			// 右
			case 2:
			if (x === 0) {
				return -1
			}
			for (let i = x - 1; i > -1; i--) {
				if (typeof this.state[i][y] !== 'undefined') {
					return {
						x: i,
						y
					}
				}
			}
			break;
			// 上
			case 3:
			if (y === this.count - 1) {
				return -1
			}
			for (let i = y + 1; i < this.count; i++) {
				if (typeof this.state[x][i] !== 'undefined') {
					return {
						y: i,
						x
					}
				}
			}
			break;
			//  下
			case 4:
			if (y === 0) {
				return -1
			}
			for (let i = y - 1; i > - 1; i--) {
				if (typeof this.state[x][i] !== 'undefined') {
					return {
						y: i,
						x
					}
				}
			}
			break;
		}
		return -1
	}

	// 有没有可以移动的方块
	hasMove (dir) {
		return this.state.some((el, x) => {
			for (let y = 0; y < this.count; y++) {
				// 为空则跳过
				if (typeof this.state[x][y] === 'undefined') {
					continue
				}
				switch (dir) {
					// 左
					case 1:
					if (x > 0) {
						if (typeof this.state[x - 1][y] === 'undefined' || this.state[x - 1][y] === this.state[x][y]) {
							return true
						}
					}
					break;
					// 右
					case 2:
					if (x < 3) {
						if (typeof this.state[x + 1][y] === 'undefined' || this.state[x + 1][y] === this.state[x][y]) {
							return true
						}
					}
					break;
					// 上
					case 3:
					if (y > 0) {
						if (typeof this.state[x][y - 1] === 'undefined' || this.state[x][y - 1] === this.state[x][y]) {
							return true
						}
					}
					break;
					//  下
					case 4:
					if (y < 3) {
						if (typeof this.state[x][y + 1] === 'undefined' || this.state[x][y + 1] === this.state[x][y]) {
							return true
						}
					}
					break;
				}
			}
			return false
		})
	}

	// 处理键盘事件
	keyboardHandle (e) {
		const ev = e || window.event
		if (ev.keyCode === 37 || ev.keyCode === 38 || ev.keyCode === 39 || ev.keyCode === 40) {
			/** 方向对应num
			**  左：1
			**  右：2
			**  上：3
			**	下：4
			**/
			switch (ev.keyCode) {
				case 37:
				// 左
				this.operate(1)
				break;
				case 39:
				// 右
				this.operate(2)
				break;
				case 38:
				// 上
				this.operate(3)
				break;
				case 40:
				// 下
				this.operate(4)
				break;
			}
		}
	}

	// 绑定键盘事件
	bindEvent () {
		canvas.addEventListener('keydown', this.keyboardHandle.bind(this))
	}
}

export default Game
