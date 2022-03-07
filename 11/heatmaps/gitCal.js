class dataCal extends Vidget {
	constructor(args) {
		super(args);
		let self = this;

		this.margin = {
			top: 70,
			bottom: 10,
			left: 40,
			right: 100
		}; // CHANGE //

		this.dims();

		this.dowData = [
			{ dow: 'Monday', short: 'M', num: 0 },
			{ dow: 'Tuesday', short: 'T', num: 1 },
			{ dow: 'Wednesday', short: 'W', num: 2 },
			{ dow: 'Thursday', short: 'T', num: 3 },
			{ dow: 'Friday', short: 'F', num: 4 },
			{ dow: 'Saturday', short: 'S', num: 5 },
			{ dow: 'Sunday', short: 'S', num: 6 }
		];

		this.monthData = [
			{ fullName: 'January', name: 'Jan', num: 1 },
			{ fullName: 'February', name: 'Feb', num: 2 },
			{ fullName: 'March', name: 'Mar', num: 3 },
			{ fullName: 'April', name: 'Apr', num: 4 },
			{ fullName: 'May', name: 'May', num: 5 },
			{ fullName: 'June', name: 'Jun', num: 6 },
			{ fullName: 'July', name: 'Jul', num: 7 },
			{ fullName: 'August', name: 'Aug', num: 8 },
			{ fullName: 'September', name: 'Sep', num: 9 },
			{ fullName: 'October', name: 'Oct', num: 10 },
			{ fullName: 'November', name: 'Nov', num: 11 },
			{ fullName: 'December', name: 'Dec', num: 12 }
		];

		let monthDs = this.monthData;
		this.makeDateFromString = function(field) {
			return new Date(`${field.slice(0, 4)}-${field.slice(4, 6)}-${field.slice(6)}`);
		};
		let makeDate = function(field) {
			return new Date(`${field.slice(0, 4)}-${field.slice(4, 6)}-${field.slice(6)}`);
		};
		let hyphonDate = function(field) {
			return `${field.slice(6)}-${field.slice(4, 6)}-${field.slice(0, 4)}`;
		};

		Date.prototype.getWeek = function() {
			var onejan = new Date(this.getFullYear(), 0, 1);
			return Math.ceil(((this - onejan) / 86400000 + onejan.getDay()) / 7);
		};

		this.markSet = new Set();
		this.hoverSet = new Set();

		this.markDate = function() {
			// console.log(self.markSet);
			let set = Array.from(self.markSet);
			let start = set[0].attributes['field'].textContent;
			let end = set[set.length - 1].attributes['field'].textContent;
			d3
				.select(`#${self.id}`)
				.select(`#${self.id}-markedDateRange`)
				.text(`${hyphonDate(start)} - ${hyphonDate(end)}`)
				.style('fill', '#e7a204');
		};

		this.hoverDate = function() {
			// console.log(self.markSet);
			let set = Array.from(self.hoverSet);
			let start = set[0].attributes['field'].textContent;
			let end = set[set.length - 1].attributes['field'].textContent;
			d3
				.select(`#${self.id}`)
				.select(`#${self.id}-markedDateRange`)
				.text(`${hyphonDate(start)} - ${hyphonDate(end)}`)
				.style('fill', 'rgb(66, 94, 112)');
		};

		let stringifyDate = function(date) {
			let year = date.getFullYear().toString();
			let mon = (date.getMonth() + 1).toString();
			let month;
			mon.length < 2 ? (month = '0' + mon) : (month = mon);
			let d = date.getDate().toString();
			let day;
			d.length < 2 ? (day = '0' + d) : (day = d);
			return parseInt(year + month + day);
		};

		this.stringifyDate = function(date) {
			let year = date.getFullYear().toString();
			let mon = (date.getMonth() + 1).toString();
			let month;
			mon.length < 2 ? (month = '0' + mon) : (month = mon);
			let d = date.getDate().toString();
			let day;
			d.length < 2 ? (day = '0' + d) : (day = d);
			return parseInt(year + month + day);
		};

		this.select = function(e) {
			let id = this.tagName !== undefined ? this.attributes['id'].textContent.split('-')[0] : this.id;

			let getMonth = monthDs;
			let selTag = this.tagName === undefined ? e.target : this;
			let pertientField = selTag.attributes['perField'].textContent;
			let target = parseInt(selTag.attributes[pertientField].textContent);
			let allCal = d3.select(`#${id}-gridGroup`).selectAll('rect').nodes().forEach((d) => {
				let testBase = makeDate(d.attributes['field'].textContent);
				let test =
					pertientField === 'monthOrder'
						? testBase.getMonth()
						: pertientField === 'dow'
							? testBase.getDay() == 0 ? 6 : testBase.getDay() - 1
							: pertientField === 'week' ? testBase.getWeek() - 1 : stringifyDate(testBase);
				if (test !== target) {
					d.classList.add('dim'); // or choose?
					// d3.select(d).style('stroke-width', 15);
				} else {
					self.hoverSet.add(d);
				}
			});
		};

		this.deselect = function() {
			let id = this.tagName !== undefined ? this.attributes['id'].textContent.split('-')[0] : this.id;
			let allCal = d3.select(`#${id}-gridGroup`).selectAll('rect').nodes().forEach((d) => {
				d.classList.remove('dim');
			});
			self.hoverSet.clear();
			// fix or not (what fixStart?):
			// console.log('fixStart ', self.fixStart);
			d3.select(`#${id}-numDayTipStart`).text('');
			d3.select(`#${id}-numDayFixStart`).style('fill-opacity', 1);
			d3.select(`#${id}-numDayTipEnd`).text('');
			d3.select(`#${id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
				d.style['fontWeight'] = 400;
				d.style['fontSize'] = '75%';
			});

			// legend out
			d3.select(`.${id}.legLabel.selHover`).style('fill-opacity', 0);
		};

		this.mSel = function() {
			// console.log(self.fixStart === undefined); // console.log('true');
			let evt = d3.event;
			if (self.fixStart === undefined) {
				self.select(evt);
				self.showNumTip(evt, 'left');
			} else {
				self.showNumTip(evt, 'right');
			}
			//legend on
			d3.select(`.${this.id.split('-')[0]}.legLabel.selHover`).style('fill-opacity', 1);
		};

		this.showNumTip = function(e, mode) {
			// show next to month for beggining... then to the right for end (that's range selection).
			let rect = e.target;
			let id = rect.attributes['id'].textContent.split('-')[0];

			let text = e.target.attributes['field'].textContent.slice(6);
			let m = d3.select(`#${id}-monthGroup`).selectAll('text').nodes()[
				+rect.getAttribute('field').slice(4, 6) - 1
			];
			// check here if there is a fixed one and the same as current month.
			let x = m.getCTM()['e'];
			let p = m.getBBox().width;
			let y = d3.select(`#${id}-monthGroup`).node().getCTM()['f'];

			if (mode === 'left') {
				d3.select(`#${id}-numDayTipStart`).attr('transform', `translate(${x - p * 0.5 - 15},${y})`).text(text);
				// hide the fixed one if it's the same month (comes from var m):
				let fixStartLoc;
				if (d3.select(`#${id}-numDayFixStart`).node().attributes['monthNum'] !== undefined) {
					fixStartLoc = d3.select(`#${id}-numDayFixStart`).node().attributes['monthNum'].textContent;
				}
				if (m.attributes['monthNum'].textContent == fixStartLoc) {
					d3.select(`#${id}-numDayFixStart`).style('fill-opacity', 0.1);
					console.log('here');
				}
			} else if (mode == 'right') {
				d3
					.select(`#${id}-numDayTipEnd`)
					.attr('transform', `translate(${x + p * 0.5 + 15},${y})`)
					.style('fill', '#e7a204')
					.text(text);
			}
			// mark month and others:
			let dow = rect.attributes['dow'].textContent;
			let month = rect.attributes['field'].textContent.slice(4, 6);
			let week = rect.attributes['week'].textContent;

			// maybe make permanent gold and bold on selection.
			d3.select(`#${id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
				if (+d.attributes['monthNum'].textContent == +month) {
					d.style['fontWeight'] = 'bold';
					d.style['fontSize'] = '110%';
				} else {
					d.style['fontWeight'] = 400;
					d.style['fontSize'] = '75%';
				}
			});

			let metric = +rect.getAttribute('metric');
			let legHeight = this.gridGroup.node().getBBox().height;
			let hMetric = this.i2(metric) * legHeight;
			d3
				.select(`.${id}.legLabel.selHover`)
				.text(metric)
				.transition()
				.duration(300)
				.attr('transform', `translate(${-10}, ${hMetric})`);
		};

		//here
		this.rangeSel = function(r) {
			// clear all selections:
			d3.selectAll(`.${self.id}.calDay`).nodes().forEach((d) => {
				if (d.attributes['field'].textContent !== stringifyDate(self.fixStart)) {
					d.classList.remove('filterClicked');
				}
			});
			// get date diff:
			let field = r.target.attributes['field'].textContent;
			let thisDate = new Date(`${field.slice(0, 4)}-${field.slice(4, 6)}-${field.slice(6)}`);
			let daysDiff = (thisDate - self.fixStart) / 86400000;
			// find find dates between both dates and add class to each of them.
			let passingMonths = new Set();
			if (daysDiff > 0) {
				for (let i = 0; i <= daysDiff; i++) {
					let sDate = new Date(thisDate - i * 86400000);
					passingMonths.add(sDate.getMonth() + 1);
					// find the rect with that date:
					let sDate2String = stringifyDate(sDate);
					d3.select(`#${self.id}-${sDate2String}`).node().classList.add('filterClicked');
				}
			}
			self.passingMonths = passingMonths;
		};

		this.startDragging = false;

		this.stopTheDrag = function() {
			d3.select(`#${this.id}`).node().removeEventListener('mousemove', this.traceX);
		};

		this.grabndrag = function() {
			console.log(this.startDragging);
			let newPos = function(e, item) {
				let r = item.node().getBoundingClientRect();
				let posNow = item.attr('transform');
				// console.log(item.node(), posNow);
				let xNow, yNow;
				if (posNow !== null) {
					// xNow = -parseInt(posNow.replace('translate(', '').split(',')[0]) + r.x;
					xNow = parseInt(posNow.replace('translate(', '').split(',')[0]) + e.movementX * 0.1;
					// xNow = r.x;
					yNow = parseInt(posNow.replace('translate(', '').split(',')[1].split(')')[0]);
				} else {
					xNow = 0;
					yNow = 0;
				}
				return [ parseInt(xNow), yNow ];
			};

			// trigger another function that moves???

			this.traceX = function(e) {
				let year = d3.select(`#${this.id}-yearControl`);
				let posYear = newPos(e, year);

				let month = d3.select(`#${this.id}-monthGroup`);
				let posMonth = newPos(e, month);

				let grid = d3.select(`#${this.id}-gridGroup`);
				let posGrid = newPos(e, grid);

				let week = d3.select(`#${this.id}-weekGroup`);
				let posWeek = newPos(e, week);

				let fixes = d3.select(`#${this.id}-fixGroup`);
				let posFixes = newPos(e, fixes);

				//here:
				year.attr('transform', `translate(${posYear[0] + e.movementX}, ${posYear[1]})`);
				month.attr('transform', `translate(${posMonth[0] + e.movementX}, ${posMonth[1]})`);
				grid.attr('transform', `translate(${posGrid[0] + e.movementX}, ${posGrid[1]})`);
				week.attr('transform', `translate(${posWeek[0] + e.movementX}, ${posWeek[1]})`);
				fixes.attr('transform', `translate(${posFixes[0] + e.movementX}, ${posFixes[1]})`);
			};
			if (this.startDragging) {
				// trace mouse event:
				d3.select(`#${this.id}`).node().addEventListener('mousemove', this.traceX);
				// load new data, erase old data:
			}
		};

		this.addGrabb = function() {
			let self = this;
			d3.selectAll('.grabber').nodes().forEach((d) => {
				d.addEventListener('mousedown', function() {
					self.startDragging = true;
					self.grabndrag();
				});
				document.addEventListener('mouseup', function() {
					self.startDragging = false;
					self.stopTheDrag();
				});
			});
		};

		//here
		this.sqClick = function(e) {
			// console.log(e);
			if (self.shiftIsPressed) {
				let thisStart = this.attributes['field'].textContent;
				if (self.fixStart !== undefined) {
					self.fixEnd = new Date(`${thisStart.slice(0, 4)}-${thisStart.slice(4, 6)}-${thisStart.slice(6)}`);
					d3.selectAll(`.${self.id}.calDay`).nodes().forEach((d) => {
						d.removeEventListener('mouseover', self.rangeSel);
					});
					self.clickedArray.add(self.stringifyDate(self.fixStart));
					self.clickedArray.add(self.stringifyDate(self.fixEnd));
					// console.log(self.clickedArray);

					let transform = d3.select(`#${self.id}-numDayTipEnd`).attr('transform');
					let text = d3.select(`#${self.id}-numDayTipEnd`).node().textContent;
					d3.select(`#${self.id}-numDayFixEnd`).attr('transform', transform).text(text);

					// make months bright too.
					d3.select(`#${self.id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
						if (self.passingMonths.has(+d.attributes['monthNum'].textContent)) {
							d.style['fill'] = '#e7a204';
						} else {
							d.style['fill'] = 'black';
						}
					});
					self.fixStart = undefined;
					self.fixEnd = undefined;
				} else {
					self.fixStart = new Date(`${thisStart.slice(0, 4)}-${thisStart.slice(4, 6)}-${thisStart.slice(6)}`);
					d3.selectAll(`.${self.id}.calDay`).nodes().forEach((d) => {
						d.addEventListener('mouseover', self.rangeSel);
					});
					this.classList.add('filterClicked');

					// fix tip left:
					d3.selectAll(`.${self.id}.numDayFix`).each((d) => {
						d3.select(this).text('');
					});
					let transform = d3.select(`#${self.id}-numDayTipStart`).attr('transform');
					let text = d3.select(`#${self.id}-numDayTipStart`).node().textContent;
					let month = +thisStart.slice(4, 6);
					d3
						.select(`#${self.id}-numDayFixStart`)
						.attr('transform', transform)
						.text(text)
						.attr('monthNum', month);

					// start tip right:
					self.showNumTip(d3.event, 'right');
				}
			} else {
				d3.select(`#${self.id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
					d.style['fill'] = 'black';
				});
				d3.select(`#${self.id}-numDayFixStart`).text('');
				d3.select(`#${self.id}-numDayFixEnd`).text('');
				let allFigs = d3.selectAll(`rect.${self.id}.calDay`).nodes();
				self.choose(allFigs, this);
				console.log(self.clickedArray);
			}
		};
	}

	scales() {
		this.week = {
			Monday: 0,
			Tuesday: 1,
			Wednesday: 2,
			Thursday: 3,
			Friday: 4,
			Saturday: 5,
			Sunday: 6
		};
		this.dow = function(dow) {
			return this.week[dow];
		};

		this.i = d3.scaleLinear().range([ 0.2, 1 ]);
		this.i2 = d3.scaleLinear().range([ 1, 0 ]);
	}

	draw(opt) {
		let self = this;
		this.scales();
		this.element.innerHtml = '';
		this.svg = d3
			.select(this.element)
			.append('svg')
			.attr('id', this.id)
			.attr('class', 'disableselect')
			.attr('group', this.group)
			.style('background-color', 'transparent')
			.style('cursor', 'default')
			.attr('width', this.totalWidth)
			.attr('height', this.totalHeight);

		this.chartGroup = this.svg.append('g').attr('id', `${this.id}-chartGroup`);
		this.gridGroup = this.chartGroup.append('g').attr('id', `${this.id}-gridGroup`);

		this.dowGroup = this.chartGroup
			.append('g')
			.attr('id', `${this.id}-dowGroup`)
			.attr('transform', `translate(${-15},${0})`); // CHANGE //
		this.weekGroup = this.chartGroup.append('g').attr('id', `${this.id}-weekGroup`);
		this.monthGroup = this.chartGroup
			.append('g')
			.attr('id', `${this.id}-monthGroup`)
			.attr('transform', `translate(${0},${-15})`); // CHANGE //

		this.yearGroup = this.chartGroup
			.append('g')
			.attr('id', `${this.id}-yearGroup`)
			.attr('transform', `translate(${0},${-this.margin.top + 30})`); // CHANGE //

		// CHANGE
		// this.yearGroup
		// 	.append('rect')
		// 	.attr('id', `${this.id}-yearBackRect`)
		// 	.attr('class', 'grabber')
		// 	.attr('width', this.width)
		// 	.attr('height', 20)
		// 	.attr('rx', 5)
		// 	.attr('ry', 20)
		// 	// .attr('transform', `translate(${-10},${-29})`)
		// 	.style('fill', 'rgba(200,200,200,0.2)');
		// CHANGE //

		this.yearControl = this.yearGroup.append('g').attr('id', `${this.id}-yearControl`);
		// .attr('transform', `translate(${this.margin.left - 5},${0})`); // CHANGE //

		this.legendGroup = this.svg
			.append('g')
			.attr('id', `${this.id}-legendGroup`)
			.attr('transform', `translate(${this.totalWidth - this.margin.right}, ${0})`);

		this.legendGroup
			.append('text')
			.attr('class', `${this.id} legLabel max`)
			.style('fill', 'black')
			.style('font-family', 'Arial Narrow, Roboto')
			.style('font-weight', 400)
			.style('font-size', '70%')
			.style('text-anchor', 'middle')
			.text('asdsadas');

		this.legendGroup
			.append('text')
			.attr('class', `${this.id} legLabel min`)
			.style('fill', 'black')
			.style('font-family', 'Arial Narrow, Roboto')
			.style('font-weight', 400)
			.style('font-size', '70%')
			.style('text-anchor', 'middle');

		this.selRangeLabel = this.legendGroup
			.append('text')
			.attr('class', `${this.id} legLabel selRange`)
			.style('fill', '#fcbe00')
			.style('font-family', 'Arial Narrow, Roboto')
			.style('font-weight', 400)
			.style('font-size', '70%')
			.style('text-anchor', 'middle');

		this.selHoverLabel = this.legendGroup
			.append('text')
			.attr('class', `${this.id} legLabel selHover`)
			.style('fill', this.colours.main)
			.style('font-family', 'Arial Narrow, Roboto')
			.style('font-weight', 400)
			.style('font-size', '70%')
			.style('text-anchor', 'end')
			.attr('transform', `translate(${-10}, ${0})`);

		for (let d = 0; d < 7; d++) {
			let height = 30;
			this.legendGroup
				.append('rect')
				.attr('class', `${this.id} legend legendSq`)
				.attr('width', 30)
				.attr('height', height)
				.attr('transform', `translate(${0}, ${d * height})`)
				.style('fill', 'black');
		}

		//visual representation of selected dates.
		this.markedDateRange = this.yearGroup
			.append('text')
			.attr('id', `${this.id}-markedDateRange`)
			// .attr('transform', `translate(${this.width / 2},${0})`)
			.style('fill', 'black')
			.style('font-family', 'Arial Narrow, Roboto')
			.style('font-weight', 900)
			.style('font-size', '120%')
			.style('text-anchor', 'middle');

		this.hoverDateRange = this.yearGroup
			.append('text')
			.attr('id', `${this.id}-hoverDateRange`)
			// .attr('transform', `translate(${this.width / 4},${0})`)
			.style('fill', 'black')
			.style('font-family', 'Arial Narrow, Roboto')
			.style('font-weight', 900)
			.style('font-size', '120%')
			.style('text-anchor', 'middle');

		this.numDay0 = this.svg
			.append('text')
			.attr('id', this.id + '-numDayTipStart')
			.attr('class', this.id + ' disableselect disablePointer numDayTip')
			.style('fill', 'black')
			.style('font-family', 'Impact')
			.style('font-size', '120%')
			.style('text-anchor', 'middle');

		this.numDay1 = this.svg
			.append('text')
			.attr('id', this.id + '-numDayTipEnd')
			.attr('class', this.id + ' disableselect disablePointer numDayTip')
			.style('fill', 'black')
			.style('font-family', 'Impact')
			.style('font-size', '120%')
			.style('text-anchor', 'middle');

		this.fixGroup = this.svg.append('g').attr('id', `${this.id}-fixGroup`);

		this.numDay2 = this.fixGroup
			.append('text')
			.attr('id', this.id + '-numDayFixStart')
			.attr('class', this.id + ' disableselect disablePointer numDayFix')
			.style('fill', '#e7a204')
			.style('font-family', 'Impact')
			.style('font-size', '120%')
			.style('text-anchor', 'middle');

		this.numDay3 = this.fixGroup
			.append('text')
			.attr('id', this.id + '-numDayFixEnd')
			.attr('class', this.id + ' disableselect disablePointer numDayFix')
			.style('fill', '#e7a204')
			.style('font-family', 'Impact')
			.style('font-size', '120%')
			.style('text-anchor', 'middle');
		this.svg.style('cursor', 'default');

		this.addGrabb();
		this.basics();

		this.f2 = this.defs
			.append('filter')
			.attr('id', 'f2')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', '100%')
			.attr('height', '100%');
		this.f2.append('feOffset').attr('result', 'offOut').attr('in', 'SourceGraphic').attr('dx', 0).attr('dy', 0);
		this.f2
			.append('feColorMatrix')
			.attr('type', 'matrix')
			.attr('in', 'offOut')
			.attr('result', 'matrixOut')
			.attr('values', '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0');
		this.f2.append('feBlend').attr('in', 'SourceGraphic').attr('in2', 'blurOut').attr('mode', 'normal');
		this.getData(opt);
	}

	getData(opt) {
		// console.log(`getData in ${this.id} has just been called for fields:`);
		let self = this;

		let dataC;
		dataC = this.data;
		'query' in opt ? (dataC = opt.query.replace('endpoint', this.id)) : (dataC = this.data); //for development only

		function fetch() {
			d3.json(dataC, function(error, fergus) {
				if (error) throw error;
				let data = fergus.vidgetData;
				if (opt.newColor) {
					self.reColor(opt.newColor);
					// self.changeMetric(opt.newColor);
				}

				if (data.length > 0) {
					self.hideEmpty();
					self.update(data);
				} else {
					self.showEmpty();
				}
			});
		}
		if (opt.interval) {
			d3.interval(function() {
				fetch();
			}, opt.interval);
		}
		fetch();
	}

	update(data) {
		// console.log(data);
		let self = this;

		// colour conversion:
		this.col = d3.hsl(self.colours.main);

		//scales domain:
		let iDom = d3.extent(
			data.map((d) => {
				return d.metric;
			})
		);
		this.i.domain(iDom);
		this.i2.domain(iDom);

		// NEW //
		var weekAmount = new Set();
		data.map((d) => {
			weekAmount.add(parseInt(d.week));
		});
		weekAmount = Array.from(weekAmount);
		// weekAmount = [ 49, 50, 51, 52, 0, 1, 2, 3 ];
		var monthAmount = new Set();
		data.map((d) => {
			let month = parseInt(d.date.slice(4, 6));
			monthAmount.add(month);
		});
		monthAmount = Array.from(monthAmount);
		let getMonthName = function(mon) {
			let monthName = self.monthData.filter((d) => {
				return d.num == monthAmount[mon];
			})[0].name;
			return monthName;
		};
		// NEW //

		let sq = this.gridGroup.selectAll('rect').data(data);
		// let gap = this.width < 1000 ? 2 : 4; // CHANGE //
		let gap = 0; // CHANGE //
		// var h0 = parseInt((this.height - 6 * gap) / 7);
		var w0 = parseFloat((this.width - (weekAmount.length - 1) * gap) / weekAmount.length); // CHANGE //
		// let h = Math.max(h0, w0); //USE THE SAME FOR SQ!!!!
		let h = w0;
		let w = w0;

		this.chartGroup.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
		this.svg.attr(
			'height',
			`${h * 7 + 6 * gap + this.yearGroup.attr('height') + 20 + this.margin.top + this.margin.bottom}` // CHANGE //
		);

		sq
			.enter()
			.append('rect')
			.attr('id', (d, i) => {
				return `${self.id}-${d.date}`;
			})
			.attr('class', (d) => {
				return `${this.id} calDay clickit ${d[self.field.x]}`;
			})
			// .attr('filter', 'url(#f2)')
			.attr('field', (d) => {
				return d.date;
			})
			.attr('perField', 'field')
			.attr('dow', (d) => {
				return d.dow;
			})
			.attr('week', (d) => {
				return d.week;
			})
			.attr(`${self.field.i}`, (d) => {
				return d.metric;
			})
			.attr('width', w) // MAKE SURE YOU USE THE SAME VALUE, THEY ARE SQUARES AFTER ALL
			.attr('height', h) // MAKE SURE YOU USE THE SAME VALUE, THEY ARE SQUARES AFTER ALL
			.attr('transform', (d, i) => {
				return `translate(${parseInt(d.week) * (w + gap)},${self.dow(d['dow']) * (h + gap)})`;
			})
			.style('cursor', 'pointer')
			.style('fill', (d) => {
				return d3.hsl(self.col.h, self.col.s, self.i(d.metric)).toString();
			})
			.style('stroke', 'rgb(200,200,200)')
			.style('stroke-opacity', 0.4)
			.style('stroke-width', 1)
			// .style('fill-opacity', (d) => {
			// 	return self.i(d.metric);
			// })
			.on('mouseover', self.mSel)
			.on('mouseout', self.deselect)
			.on('click', self.sqClick);

		sq
			.attr('id', (d, i) => {
				return `${self.id}-${d.date}`;
			})
			// .attr('filter', 'url(#f2)')
			.attr('field', (d) => {
				return d.date;
			})
			.attr('perField', 'field')
			.attr('dow', (d) => {
				return d.dow;
			})
			.attr('week', (d) => {
				return d.week;
			})
			.attr(`${self.field.i}`, (d) => {
				return d.metric;
			})
			.on('click', self.sqClick)
			.on('mouseover', self.mSel)
			.on('mouseout', self.deselect)
			.transition()
			.duration(300)
			.style('cursor', 'none')
			.attr('width', w)
			.attr('height', h)
			.attr('transform', (d, i) => {
				return `translate(${parseInt(d.week) * (w + gap)},${self.dow(d['dow']) * (h + gap)})`;
			})
			.style('stroke', 'rgb(200,200,200)')
			.style('stroke-opacity', 0.4)
			.style('stroke-width', 1)
			.style('fill', (d) => {
				return d3.hsl(self.col.h, self.col.s, self.i(d.metric)).toString();
			});
		// .style('fill-opacity', (d) => {
		// 	return self.i(d.metric);
		// });

		sq.exit().remove();

		let multiSelect = function(e) {
			self.clickedArray = new Set(
				Array.from(self.hoverSet).map((d) => {
					return d.attributes['field'].textContent;
				})
			);
			let allFigs = d3.select(`#${self.id}`).selectAll('.clickit').nodes();
			self.clickShow(allFigs);
			// reduce range:
			let r0 = Array.from(self.clickedArray).sort()[0];
			let r1 = Array.from(self.clickedArray).sort()[self.clickedArray.size - 1];
			self.clickedArray.clear();
			self.clickedArray.add(r0);
			self.clickedArray.add(r1);
			console.log('sent range = ', self.clickedArray);
		};

		this.dowGroup.selectAll('text').remove();
		this.dowData.forEach((d, i) => {
			this.dowGroup
				.append('text')
				.attr('id', `${this.id}-${d.dow}Label`)
				.attr('class', `${this.id} dowLabel`)
				.attr('perField', 'dow')
				.attr('dow', `${d.num}`)
				.attr('transform', `translate(${0},${d.num * (h + gap) + h / 2 + 5})`) // CHANGE //
				.style('fill', i === 6 ? 'red' : 'black')
				.style('font-family', 'Arial Narrow, Roboto')
				.style('font-weight', 400)
				.style('font-size', '80%')
				.style('text-anchor', 'middle')
				.style('cursor', 'pointer')
				.text(`${d.short}`)
				.on('mouseover', self.select)
				.on('mouseout', self.deselect)
				.on('click', function(e) {
					console.log('functionality under development');
					// let evt = d3.event;
					// d3.select(`#${self.id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
					// 	d.style['fill'] = 'black';
					// });
					// d3.select(`#${self.id}-numDayFixStart`).text('');
					// d3.select(`#${self.id}-numDayFixEnd`).text('');
					multiSelect(evt);
					// multiSelect(evt);
				});
		});

		let calWidth = this.gridGroup.node().getClientRects()[0].width; // NEW //
		this.monthGroup.selectAll('text').remove();
		// if we update monthData with the MS, we could be good to go.
		monthAmount.forEach((d, i) => {
			// CHANGE //
			this.monthGroup
				.append('text')
				.attr('id', `${this.id}-${getMonthName(i)}Label`) // CHANGE //
				.attr('class', `${this.id} monLabel`)
				.attr('perField', `monthOrder`)
				.attr('month', `${getMonthName(i)}`) // CHANGE //
				.attr('monthNum', `${d}`) // CHANGE //
				.attr('monthOrder', `${d - 1}`) // CHANGE //
				.attr('transform', `translate(${calWidth / monthAmount.length * (i + 0.5)},${0})`) // CHANGE //
				.style('fill', 'black')
				.style('font-family', 'Arial Narrow, Roboto')
				.style('font-weight', 400)
				.style('font-size', '90%')
				.style('text-anchor', 'middle')
				.style('cursor', 'pointer')
				.text(`${getMonthName(i)}`) // CHANGE //
				.on('mouseover', self.select)
				.on('mouseout', self.deselect)
				.on('click', function(e) {
					let evt = d3.event;
					// deselect range:
					d3.select(`#${self.id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
						d.style['fill'] = 'black';
					});
					d3.select(`#${self.id}-numDayFixStart`).text('');
					d3.select(`#${self.id}-numDayFixEnd`).text('');
					multiSelect(evt);
				});
		});

		if (self.passingMonths && self.passingMonths.size > 0) {
			d3.select(`#${self.id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
				if (self.passingMonths.has(+d.attributes['monthNum'].textContent)) {
					d.style['fill'] = '#e7a204';
				} else {
					d.style['fill'] = 'black';
				}
			});
		}

		this.weekGroup.selectAll('text').remove();
		this.weekGroup.attr('transform', `translate(${0},${h * 7 + 15})`); // font Size in px + 2 // CHANGE //

		for (let i = 0; i < weekAmount.length; i++) {
			this.weekGroup
				.append('text')
				.text(weekAmount[i]) // map to actual weeknumber (from data)
				.attr('transform', `translate(${weekAmount[i] * (w + gap) + (w + gap) / 2},${0})`) // fix to match column vertically
				.attr('id', `${this.id}-${i}`)
				.attr('class', `${this.id} weekNumber`)
				.attr('perField', `week`)
				.attr('week', i)
				.style('fill', 'black')
				.style('font-family', 'Arial Narrow, Roboto')
				.style('font-weight', 400)
				.style('font-size', '70%')
				.style('text-anchor', 'middle')
				.style('cursor', 'pointer')
				.on('mouseover', self.select)
				.on('mouseout', self.deselect)
				.on('click', function(e) {
					let evt = d3.event;
					d3.select(`#${self.id}-monthGroup`).selectAll('text').nodes().forEach((d) => {
						d.style['fill'] = 'black';
					});
					d3.select(`#${self.id}-numDayFixStart`).text('');
					d3.select(`#${self.id}-numDayFixEnd`).text('');
					multiSelect(evt);
				});
		} // should bring from date

		let yearArray = new Set();
		data.map((d) => {
			yearArray.add(+d.date.slice(0, 4));
		});
		let displayedYear = Array.from(yearArray);

		let opa = 1;

		for (let i = 0; i < displayedYear.length; i++) {
			// assuming array is in increasing order
			let d = displayedYear[i];

			let day1 = d3.select(`#${this.id}-${d}0101`).attr('transform');
			let pushRight = i == 0 ? 0 : parseInt(day1.replace('translate(', '').split(',')[0]);

			displayedYear.length > 1 && i === 0 ? 0.1 : 1; // change 0.1 for a calculated variable dependent on the x separation (to use in phase 2, when dragging years is available)
			self.yearControl
				.append('text')
				.attr('year', `${this.id}-${d}`)
				.attr('transform', `translate(${pushRight},${0})`)
				.attr('class', 'grabber')
				.style('fill', 'black')
				.style('fill-opcaity', opa)
				.style('font-family', 'Arial Narrow, Roboto')
				.style('font-weight', 400)
				.style('font-size', '120%')
				.style('text-anchor', 'middle')
				.text(`${d}`);
		}

		let posLegend = d3.select(`#${this.id}-chartGroup`).attr('transform');
		let getPosFromAttr = function(str) {
			let broken = str.replace('translate(', '').split(',');
			let x = parseInt(broken[0]);
			let y = parseInt(broken[1].split(')')[0]);
			return [ x, y ];
		};

		d3.select(`#${this.id}-yearBackRect`).attr('width', this.gridGroup.node().getBBox().width + 15);

		d3.select(`.${this.id}.legLabel.max`).text(`${iDom[1]}`).attr('transform', `translate(${w / 2}, ${-5})`);
		d3
			.select(`.${this.id}.legLabel.min`)
			.text(`${iDom[0]}`)
			.attr('transform', `translate(${w / 2}, ${7 * (w + 2) + 10})`);

		this.legendGroup.attr('transform', `translate(${self.totalWidth - w - 10}, ${getPosFromAttr(posLegend)[1]})`);

		let adjustLegend = function(d, i) {
			d3
				.select(this)
				.attr('width', w)
				.attr('height', h)
				.attr('transform', (d) => {
					return `translate(${0},${i * (h + gap)})`;
				})
				.attr('metric', (d) => {
					let v = (iDom[1] - 4) / 7 * (7 - i) + 4;
					return v;
				})
				.style('fill', self.colours.main)
				.style('fill-opacity', (d) => {
					return self.i((7 - i) * iDom[1] / 7);
				})
				.on('mouseover', function() {
					let v = parseInt(this.attributes['metric'].textContent);
				});
		};
		d3.selectAll(`rect.${this.id}.legendSq`).each(adjustLegend);
	}
}
