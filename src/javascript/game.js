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
	leftOperate (dir) {
		if (this.canMove(dir)) {
			this.justMove(dir)
		}
		this.drawAll()
	}

	// 左右移动还是有问题，弄完左右弄上下，一步步来吧，碎了
	// 进行移动操作
	justMove (dir) {
		const fn = (x, y, tempx, tempy) => {
			if (typeof this.state[x][y] === 'undefined') {
				this.state[x][y] = this.state[tempx][tempy]
				this.state[tempx][tempy] = undefined

				this.delFromRandArr(y * this.count + x, this.randArr)
				this.insetToRandArr(tempy * this.count + tempx, this.randArr)
				if (dir === 1) {
					x--
				}
				if (dir === 2) {
					x++
				}
				if (dir === 3) {
					y++
				}
				if (dir === 4) {
					y--
				}
			} else {
				if (this.state[x][y] === this.state[tempx][tempy]) {
					this.state[x][y] *= 2
					this.state[tempx][tempy] = undefined

					this.insetToRandArr(tempy * this.count + tempx, this.randArr)
					if (dir === 1) {
						x--
					}
					if (dir === 2) {
						x++
					}
					if (dir === 3) {
						y++
					}
					if (dir === 4) {
						y--
					}
				} else {
					if (dir === 1 && x + 1 !== tempx) {
						this.state[x + 1][y] = this.state[tempx][tempy]
						this.state[tempx][tempy] = undefined
						this.delFromRandArr(y * this.count + x + 1, this.randArr)
						this.insetToRandArr(tempy * this.count + tempx, this.randArr)
						if (dir === 1) {
							x--
						}
						if (dir === 2) {
							x++
						}
						if (dir === 3) {
							y++
						}
						if (dir === 4) {
							y--
						}
					}
					if (dir === 2 && x - 1 !== tempx) {
						this.state[x - 1][y] = this.state[tempx][tempy]
						this.state[tempx][tempy] = undefined
						this.delFromRandArr(y * this.count + x - 1, this.randArr)
						this.insetToRandArr(tempy * this.count + tempx, this.randArr)
						if (dir === 1) {
							x--
						}
						if (dir === 2) {
							x++
						}
						if (dir === 3) {
							y++
						}
						if (dir === 4) {
							y--
						}
					}
					if (dir === 3 && y + 1 !== tempx) {
						this.state[x][y + 1] = this.state[tempx][tempy]
						this.state[tempx][tempy] = undefined
						this.delFromRandArr((y + 1) * this.count + x, this.randArr)
						this.insetToRandArr(tempy * this.count + tempx, this.randArr)
						if (dir === 1) {
							x--
						}
						if (dir === 2) {
							x++
						}
						if (dir === 3) {
							y++
						}
						if (dir === 4) {
							y--
						}
					}
					if (dir === 4 && y + 1 !== tempx) {
						this.state[x][y + 1] = this.state[tempx][tempy]
						this.state[tempx][tempy] = undefined
						this.delFromRandArr((y + 1) * this.count + x, this.randArr)
						this.insetToRandArr(tempy * this.count + tempx, this.randArr)
						if (dir === 1) {
							x--
						}
						if (dir === 2) {
							x++
						}
						if (dir === 3) {
							y++
						}
						if (dir === 4) {
							y--
						}
					}
				}
			}
		}

		// 左
		if (dir === 1) {
			for (let y = 0; y < this.count; y++) {
				for (let x = 0; x < this.count; x++) {
					// 一个比较重要的点：因为randarr的长度改变了，所以出现bug
					let condition = this.findExist(x, y, dir)

					if (condition !== -1) {
						const {x: tempx, y: tempy} = condition
						fn(x, y, tempx, tempy)
					}
				}
			}
		}
		// 右
		if (dir === 2) {
			for (let y = 0; y < this.count; y++) {
				for (let x = this.count - 1; x > -1; x--) {
					// 一个比较重要的点：因为randarr的长度改变了，所以出现bug
					let condition = this.findExist(x, y, dir)

					if (condition !== -1) {
						const {x: tempx, y: tempy} = condition
						fn(x, y, tempx, tempy)
					}
				}
			}
		}
		// 上
		if (dir === 3) {
			for (let x = 0; x < this.count; x++) {
				for (let y = 0; y < this.count; y++) {
					// 一个比较重要的点：因为randarr的长度改变了，所以出现bug
					let condition = this.findExist(x, y, dir)
					console.log(condition)

					if (condition !== -1) {
						const {x: tempx, y: tempy} = condition
						fn(x, y, tempx, tempy)
					}
				}
			}
		}
		// 下
		if (dir === 4) {
			for (let x = 0; x < this.count; x++) {
				for (let y = this.count - 1; y > -1; y--) {
					// 一个比较重要的点：因为randarr的长度改变了，所以出现bug
					let condition = this.findExist(x, y, dir)

					if (condition !== -1) {
						const {x: tempx, y: tempy} = condition
						fn(x, y, tempx, tempy)
					}
				}
			}
		}
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

	// 找不为undefined的,这个时候向左移动的时候用的
	findExist (x, y, dir) {
		// 左
		if (dir === 1) {
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
		}
		// 右
		if (dir === 2) {
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
		}
		// 上
		if (dir === 3) {
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
		}
		//  下
		if (dir === 4) {
			if (y === 0) {
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
		}
		return -1
	}

	// 能不能移动
	canMove (dir) {
		return this.state.some((el, i) => {
			for (let j = 0; j < this.count; j++) {
				// 左
				if (dir === 1 && typeof this.state[i][j] !== 'undefined' && i > 0) {
					if (typeof this.state[i - 1][j] === 'undefined' || this.state[i - 1][j] === this.state[i][j]) {
						return true
					}
				}
				// 右
				if (dir === 2 && typeof this.state[i][j] !== 'undefined' && i < 3) {
					if (typeof this.state[i + 1][j] === 'undefined' || this.state[i + 1][j] === this.state[i][j]) {
						return true
					}
				}
				// 上
				if (dir === 3 && typeof this.state[i][j] !== 'undefined' && j > 0) {
					if (typeof this.state[j - 1][i] === 'undefined' || this.state[j - 1][i] === this.state[i][j]) {
						return true
					}
				}
				//  下
				if (dir === 4 && typeof this.state[i][j] !== 'undefined' && j < 3) {
					if (typeof this.state[j + 1][i] === 'undefined' || this.state[j + 1][i] === this.state[i][j]) {
						return true
					}
				}
			}
			return false
		})
	}

	// 处理键盘事件
	keyboardHandle (e) {
		const ev = e || window.event


		this.ctx.clearRect(0, 0, this.size, this.size)
		this.ctx.fillStyle = '#BBADA0'
		this.ctx.fillRect(0, 0, this.size, this.size)
		this.drawBg()


		/** 方向对应num
		**  左：1
		**  右：2
		**  上：3
		**	下：4
		**/
		switch (ev.keyCode) {
			case 37:
			// console.log('左')
			this.leftOperate(1)
			break;
			case 39:
			// console.log('右')
			this.leftOperate(2)
			break;
			case 38:
			// console.log('上')
			this.leftOperate(3)
			break;
			case 40:
			// console.log('下')
			this.leftOperate(4)
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
