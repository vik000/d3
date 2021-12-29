class LineChart {
	constructor(args) {
		this.data = args.data;
		this.element = args.element;
		this.id = args.id;
		this.field = args.field;
		this.units = args.units;

		// get params in args:
		this.totalHeight = 300;
		'width' in args ? (this.totalWidth = args.width) : (this.totalWidth = 700);
		'margin' in args
			? (this.margin = args.margin)
			: (this.margin = {
					top: 30,
					right: 10,
					bottom: 35,
					left: 40
				});
		this.height = this.totalHeight - this.margin.top - this.margin.bottom;
		this.width = this.totalWidth - this.margin.left - this.margin.right;
		'title' in args ? (this.title = args.title) : (this.title = '');

		let self = this;
		function getMetric() {
			if (self.field.y.includes('conv')) {
				return 'conversion';
			} else if (
				self.field.y.includes('rev') ||
				self.field.y.includes('rev_per_booking') ||
				self.field.y.includes('arpb')
			) {
				return 'arpb';
			} else if (self.field.y.toLowerCase().includes('rpd') || self.field.y.toLowerCase().includes('rate')) {
				return 'rpd';
			} else if (self.field.y.toLowerCase().includes('total')) {
				return 'revenue';
			} else {
				return 'default';
			}
		}

		this.cScheme = {
			revenue: '#DB5461',
			conversion: '#00acc1',
			arpb: '#ffab00',
			rpd: '#D90368',
			nonAI: '#546e7a',
			default: '#263238'
		};

		'colours' in args
			? (this.colours = args.colours)
			: (this.colours = this.colours = {
					main: this.cScheme[`${getMetric()}`],
					secondary: this.cScheme['nonAI']
				});

		this.parseTime = d3.timeParse('%Y%m%d');
		this.bisectDate = d3.bisector(function(d) {
			return d.date;
		}).left;
		this.formatTime = d3.timeFormat('%A %d %B %Y');
		this.getWeek = d3.timeFormat('%W');
	}

	scales() {
		this.x = d3.scaleTime().range([ 0, this.width ]);
		this.y = d3.scaleLinear().range([ this.height, 0 ]);

		this.xAxis = d3.axisBottom().scale(this.x); //.ticks(d3.timeDay.every(7))
		this.yAxis = d3.axisLeft().scale(this.y);
	}

	draw(opt) {
		let self = this;
		this.scales();
		this.element.innerHtml = '';

		this.svg = d3
			.select(this.element)
			.append('svg')
			.attr('id', this.id)
			.attr('width', this.totalWidth)
			.attr('height', this.totalHeight);

		this.title = this.svg
			.append('text')
			.attr('id', `${this.id}-title`)
			.attr('transform', `translate(${this.totalWidth / 2}, ${20})`)
			.style('font-family', 'Arial Narrow')
			.style('font-weight', 'bold')
			.style('font-size', '21px')
			.style('text-anchor', 'middle')
			.text(`${this.title}`);

		this.weeks = this.svg
			.append('text')
			.attr('id', `${this.id}-title`)
			.attr('transform', `translate(${this.width / 2}, ${this.totalHeight})`)
			.style('font-family', 'Arial Narrow')
			.style('font-weight', '400')
			.style('font-size', '0.8em')
			.style('text-anchor', 'start')
			.text(`Week of the Year`);

		this.xAxisGroup = this.svg
			.append('g')
			.attr('class', 'x axis')
			.attr('id', `${this.id}-xAxis`)
			.attr('transform', `translate(${self.margin.left}, ${this.height + this.margin.top})`);

		this.yAxisGroup = this.svg
			.append('g')
			.attr('transform', `translate(${self.margin.left}, ${this.margin.top})`)
			.attr('class', 'y axis');

		this.customYAxis = function customYAxis(g) {
			g.transition().call(self.yAxis.tickSizeOuter(0));
		};

		this.customXAxis = function customXAxis(g) {
			g.transition().call(self.xAxis);
			g.select('.domain').remove();
			g.selectAll('.tick').each(function(d, i) {
				// console.log(d.getDay());
				if (self.getWeek(d) == '51') {
					d3.select(this).select('text').style('font-size', 16).style('font-weight', 'bold');
				}
			});
		};

		// lines and areas:
		this.groupLine = this.svg
			.append('g')
			.attr('id', `${this.id}-lineGroup`)
			.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

		this.clipBelow = this.groupLine.append('clipPath').attr('id', `${this.id}-clip-below`).append('path');

		this.clipAbove = this.groupLine.append('clipPath').attr('id', `${this.id}-clip-above`).append('path');

		this.areaAbove = this.groupLine
			.append('path')
			.attr('class', `area above ${this.id}`)
			.style('fill', this.colours.secondary)
			.style('opacity', 0.2)
			.attr('clip-path', `url(#${this.id}-clip-above)`);

		this.areaBelow = this.groupLine
			.append('path')
			.attr('class', `area below ${this.id}`)
			.style('fill', this.colours.main)
			.style('opacity', 0.2)
			.attr('clip-path', `url(#${this.id}-clip-below)`);

		this.chartLine2 = this.groupLine
			.append('path')
			.attr('id', `${this.id}-line2`)
			.attr('class', `${this.id} line2`)
			.style('stroke', this.colours.secondary)
			.style('opacity', 0.1);

		this.chartLine = this.groupLine
			.append('path')
			.attr('id', `${this.id}-line`)
			.attr('class', `${this.id} line`)
			.style('stroke', this.colours.main)
			.style('opacity', 0.8);

		/// Tooltip:
		this.focusContainer = this.svg
			.append('g')
			.attr('transform', `translate(${this.margin.left},${this.margin.top})`);

		this.focus = this.focusContainer.append('g').attr('class', `${this.id}-focus`);

		this.tipLine = this.focus
			.append('line')
			.attr('class', `x-hover-line hover-line ${this.id}-tip-yLine`)
			.style('stroke', this.colours.main)
			.style('stroke-width', '2px')
			.style('stroke-dasharray', '3,3')
			.attr('y1', 0)
			.attr('y2', this.height);

		this.focus
			.append('circle')
			.attr('id', `${this.id}-AI-tip-circle`)
			.attr('class', `${this.id} AI circulo`)
			.attr('stroke', this.colours.main)
			.style('fill', '#fff')
			.attr('r', 7.5);

		this.focus
			.append('circle')
			.attr('id', `${this.id}-NONE-tip-circle`)
			.attr('class', `${this.id} AI circulo`)
			.attr('stroke', this.colours.secondary)
			.style('fill', '#fff')
			.attr('r', 7.5);

		this.focus
			.append('text')
			.attr('id', `${this.id}-AI-tip-text`)
			.attr('class', `${this.id}-tip-text`)
			.attr('x', 15)
			.attr('dy', '.31em')
			.style('font-family', 'Arial, Helvetica, sans-serif');

		this.focus
			.append('text')
			.attr('id', `${this.id}-NONE-tip-text`)
			.attr('class', `${this.id}-tip-text`)
			.attr('x', 15)
			.attr('dy', '.31em')
			.style('font-family', 'Arial, Helvetica, sans-serif');

		this.focus
			.append('text')
			.attr('id', `${this.id}-performance`)
			.attr('x', 0)
			.attr('dy', '20px')
			.style('font-family', "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif")
			.style('font-size', '3.6em');

		this.focus
			.append('text')
			.attr('id', `${this.id}-exactDate`)
			.attr('x', 0)
			.attr('dy', '.31em')
			.style('opacity', '0')
			.style('font-family', 'Arial, Helvetica, sans-serif');

		this.overlay = this.svg
			.append('rect')
			.attr('id', `${this.id}-overlay`)
			.attr('class', `${this.id} overlay`)
			.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
			.attr('width', this.width)
			.attr('height', this.height)
			.style('fill', 'transparent')
			.on('mouseover', function() {
				self.focus.style('display', null);
				d3.select(`.area.above.${self.id}`).attr('class', `area above ${self.id}-areaSelection`);
				d3.select(`.area.below.${self.id}`).attr('class', `area below ${self.id}-areaSelection`);
				d3.select(`#${self.id}-line`).attr('class', `line-lineSelect`);
				d3.select(`#${self.id}-line2`).attr('class', `line2-lineSelect`);
			});
		// .on('mouseout', function(){
		//     self.focus.style('display', 'none')
		//     d3.select(`.area.above.${self.id}-areaSelection`).attr('class', `area above ${self.id}`);
		//     d3.select(`.area.below.${self.id}-areaSelection`).attr('class', `area below ${self.id}`);
		//     d3.select(`#${self.id}-line`).attr('class', ``);
		//     d3.select(`#${self.id}-line2`).attr('class', ``);
		// });

		this.empty = this.svg
			.append('rect')
			.attr('id', `${this.id}-empty`)
			.attr('class', `hidden`)
			.style('fill', 'rgba(230,230,230,0.5)')
			.attr('width', this.totalWidth)
			.attr('height', this.totalHeight);

		this.emptyText = this.svg
			.append('text')
			.attr('id', `${this.id}-emptyText`)
			.attr('class', `hidden`)
			.attr('transform', `translate(${this.totalWidth / 2}, ${this.totalHeight / 2})`)
			.style('font-size', 33)
			.style('font-family', 'Impact')
			.style('font-weight', 'bold')
			.style('color', '#666')
			.style('text-anchor', 'middle')
			.text('No data found for this period');

		this.emptyText2 = this.svg
			.append('text')
			.attr('id', `${this.id}-emptyText2`)
			.attr('class', `hidden`)
			.attr('transform', `translate(${this.totalWidth / 2}, ${this.totalHeight / 2 + 37})`)
			.style('font-size', 33)
			.style('font-family', 'Impact')
			.style('font-weight', 'bold')
			.style('color', '#666')
			.style('text-anchor', 'middle')
			.text('');

		this.getData(opt);
	}

	getData(opt) {
		let self = this;
		let dataC = this.data;
		function fetch() {
			d3.json(dataC, function(error, fergus) {
				if (error) throw error;
				let data = fergus.vidgetData;

				if (data.length > 0) {
					self.hideEmpty();
					data.forEach(function(d) {
						d[`${self.field.x}`] = self.parseTime(d[`${self.field.x}`]);
						d[`${self.field.y}`] = +d[`${self.field.y}`];
						d[`${self.field.y2}`] = +d[`${self.field.y2}`];
					});
					self.update(data);
				} else {
					self.showEmpty();
				}
			});
		}
		d3.interval(function() {
			fetch();
		}, opt.interval);
		fetch();
	}

	update(data) {
		let self = this;
		let easeType = d3.easeExp;
		let easeDuration = 300;

		this.xAxis.ticks(data.length);

		// console.log(data);
		this.svg.datum(data);
		this.x.domain(
			d3.extent(
				data.map((d) => {
					return d[`${self.field.x}`];
				})
			)
		);
		this.y.domain([
			d3.min(data, function(d) {
				return Math.min(d[`${self.field.y}`], d[`${self.field.y2}`]);
			}) * 0.9, // CHANGE
			d3.max(data, function(d) {
				return Math.max(d[`${self.field.y}`], d[`${self.field.y2}`]);
			}) * 1.02
		]);

		self.xAxis.tickFormat(function(d, i) {
			if (self.getWeek(d) == '51') {
				return `${parseInt(d.getFullYear()) + 1}`;
			} else {
				return `${parseInt(self.getWeek(d)) + 2}`;
			}
		}); // here I can change ticker format depending on data domain.

		this.yAxisGroup.call(self.customYAxis);
		this.xAxisGroup.call(self.customXAxis);

		let drawLine = d3
			.area()
			.curve(d3.curveCardinal)
			.x(function(d) {
				// console.log(d, self.x(d[self.field.x]));
				return self.x(d[self.field.x]);
			})
			.y(function(d) {
				// console.log(d, self.y(d[self.field.y]));
				return self.y(d[self.field.y]);
			});

		let drawLine2 = d3
			.area()
			.curve(d3.curveCardinal)
			.x(function(d) {
				return self.x(d[`${self.field.x}`]);
			})
			.y(function(d) {
				return self.y(d[`${self.field.y2}`]);
			});

		let area = d3
			.area()
			.curve(d3.curveCardinal)
			.x(function(d) {
				return self.x(d[`${self.field.x}`]);
			})
			.y1(function(d) {
				return self.y(d[`${self.field.y}`]);
			});

		this.chartLine.transition().duration(easeDuration).attr('d', drawLine(data));
		this.chartLine2.transition().duration(easeDuration).attr('d', drawLine2(data));

		area.y0(this.height);
		this.clipBelow.transition().duration(easeDuration).attr('d', area(data));
		area.y0(0);
		this.clipAbove.transition().duration(easeDuration).attr('d', area(data));

		area.y0((d) => {
			return self.y(d[`${self.field.y2}`]);
		});
		this.areaAbove.transition().duration(easeDuration).attr('d', area(data));

		this.areaBelow.transition().duration(easeDuration).attr('d', area(data));

		this.moveTip = function(lastDate) {
			let circleRadio = d3.select(`#${self.id}-AI-tip-circle`).attr('r');
			let perfWidth = d3.select(`#${self.id}-performance`)._groups[0][0].textLength.baseVal.value;
			let dateWidth = d3.select(`#${self.id}-exactDate`)._groups[0][0].textLength.baseVal.value;
			let PerfHeight = parseInt(getComputedStyle(document.getElementById(`${self.id}-performance`)).fontSize);
			let dateHeight = parseInt(getComputedStyle(document.getElementById(`${self.id}-exactDate`)).fontSize);
			let perf_date_separation = PerfHeight * 0.6;
			let reqDis = PerfHeight + dateHeight + perf_date_separation + 10;

			//////////// START
			let d;
			if (lastDate) {
				// if date is input:
				// console.log(lastDate);
				d = lastDate;
			} else {
				// else get from cursor:
				let allNodes = self.xAxisGroup.selectAll('text').nodes();

				let mouseX = d3.mouse(this)[0];
				let eachBand = self.width / data.length;
				let i0 = parseInt(mouseX / eachBand);
				let i = data.length - i0 - 1 > allNodes.length - 1 ? allNodes.length - 1 : data.length - i0 - 1;
				d = data[i];

				allNodes.forEach((d) => {
					if (self.getWeek(d['__data__']) !== '51') {
						// console.log('year');
						d.style['font-weight'] = 400;
						d.style['font-size'] = 10;
					}
					d.style['fill-opacity'] = 0.3;
				});

				self.xAxisGroup.selectAll('text').nodes().reverse()[i].style['fontWeight'] = 'bold';
				self.xAxisGroup.selectAll('text').nodes().reverse()[i].style['fontSize'] = 16;
				self.xAxisGroup.selectAll('text').nodes().reverse()[i].style['fill-opacity'] = 1;
			}

			/////////// END

			let LeftPadding = 5;
			let r0 = self.x(new Date(d[`${self.field.x}`]));
			let r1 = d3.select(`#${self.id}-exactDate`)._groups[0][0].textLength.baseVal.value;
			let r2 = LeftPadding;
			let r = r0 + (r1 + r2);

			let dis2Top = Math.min(self.y(d[`${self.field.y}`]), self.y(d[`${self.field.y2}`]));
			let dis2Bottom = Math.min(
				self.height - self.y(d[`${self.field.y}`]),
				self.height - self.y(d[`${self.field.y2}`])
			);

			let curveDiff = self.y(d[`${self.field.y2}`]) - self.y(d[`${self.field.y}`]);
			let perfLocation = { val: 0 }; // CHANGE

			//////////// START
			let pushLeft;
			if (lastDate) {
				pushLeft = -20; // CHANGE
				perfLocation.anchor = 'end'; // CHANGE
			} else {
				pushLeft = r < self.width ? -perfWidth / 4 : -(perfWidth + 10);
				// pushLeft = -20;
				perfLocation.anchor = 'start'; // CHANGE
			}
			//////////// END
			let noSpaceFix = 0;

			if (Math.abs(curveDiff) > reqDis) {
				// console.log(curveDiff);
				// console.log(reqDis);
				perfLocation.val = curveDiff / 2;
			} else if (dis2Bottom > reqDis || dis2Top > reqDis) {
				// console.log('not enough space');
				if (dis2Bottom > dis2Top) {
					if (d[`${self.field.y}`] > d[`${self.field.y2}`]) {
						perfLocation.val = curveDiff + PerfHeight * 0.8;
					} else {
						perfLocation.val = PerfHeight;
					}
					perfLocation.pos = 'down';
				} else if (dis2Top > dis2Bottom) {
					if (d[`${self.field.y}`] > d[`${self.field.y2}`]) {
						perfLocation.val = -PerfHeight;
					} else {
						perfLocation.val = -Math.abs(curveDiff) - PerfHeight * 0.8;
					}
					perfLocation.pos = 'up';
				}
			} else {
				// console.log('nowhere to go');
				noSpaceFix = PerfHeight / 2;
				perfLocation.val = curveDiff / 2;
			}

			self.focus.attr('transform', `translate( ${self.x(d[self.field.x])} , ${self.y(d[self.field.y])} )`);
			self.focus
				.select(`#${self.id}-AI-tip-text`)
				.text(function() {
					return `AI Engine: ${d[`${self.field.y}`].toFixed(2)} ${self.units.y}`;
				})
				// CHANGE
				.attr(
					'transform',
					`translate( ${r < self.width ? 0 : -30} , ${Math.abs(curveDiff) > 10
						? 0
						: d[`${self.field.y}`] > d[`${self.field.y2}`] ? -10 : 10} )`
				)
				.style('font-weight', 'bold')
				.style('text-anchor', `${r < self.width ? 'start' : 'end'}`);
			self.focus
				.select(`#${self.id}-NONE-tip-text`)
				.attr(
					'transform',
					`translate( ${r < self.width ? 0 : -30} , ${Math.abs(curveDiff) > 10
						? curveDiff
						: d[`${self.field.y}`] > d[`${self.field.y2}`] ? 10 : -10})`
				)
				.text(function() {
					return `No Engine: ${d[`${self.field.y2}`].toFixed(2)} ${self.units.y2}`;
				})
				.style('font-weight', 'bold')
				.style('text-anchor', `${r < self.width ? 'start' : 'end'}`);
			self.focus
				.select(`#${self.id}-performance`)
				.attr('transform', `translate( ${pushLeft} , ${perfLocation.val})`) // substract textHeight and textWidth
				// change the vertical translation if the number is less than the textHeight
				.text(function() {
					var result = ((d[`${self.field.y}`] / d[`${self.field.y2}`] - 1) * 100).toFixed(0);
					return result === 0 ? '0' : result > 0 ? `+ ${result} %` : `${result} %`;
				})
				.style('fill', function() {
					var result = d[`${self.field.y}`] / d[`${self.field.y2}`] - 1;
					return result > 0 ? self.colours.main : self.colours.secondary;
				})
				.style('text-anchor', perfLocation.anchor); // CHANGE
			self.focus
				.select(`#${self.id}-exactDate`)
				.text(function() {
					return self.formatTime(d[`${self.field.x}`]);
				})
				.attr(
					'transform',
					`translate( 
                    ${r < self.width ? LeftPadding : -LeftPadding}, 
                    ${perfLocation.pos == 'down'
						? perfLocation.val + perf_date_separation + noSpaceFix
						: perfLocation.val - perf_date_separation + noSpaceFix})`
				)
				.style('text-anchor', `${r < self.width ? 'start' : 'end'}`);

			self.focus.select(`#${self.id}-NONE-tip-circle`).attr('transform', `translate( 0 , ${curveDiff})`);

			self.tipLine.attr('y2', curveDiff); // this changes the hoverLine height
			self.tipLine.style('stroke', function() {
				return curveDiff < 0 ? self.colours.secondary : self.colours.main;
			});
		};

		let regenTicks = function() {
			// let self = this;
			self.xAxisGroup.selectAll('text').nodes().forEach((d) => {
				if (self.getWeek(d['__data__']) !== '51') {
					// console.log('year');
					d.style['font-weight'] = 400;
					d.style['font-size'] = 10;
				}
				d.style['fill-opacity'] = 1;
			});
			// moveTip(data[0]);
		};

		this.overlay.on('mousemove', this.moveTip); //overlay
		this.overlay.on('mouseout', regenTicks); //overlay

		this.moveTip(data[0]);
	}

	showEmpty() {
		let self = this;
		self.empty.attr('class', '');
		self.emptyText.attr('class', '');
		self.emptyText2.attr('class', '');
		self.wrap();
	}

	hideEmpty() {
		let self = this;
		self.empty.attr('class', 'hidden');
		self.emptyText.attr('class', 'hidden');
		self.emptyText2.attr('class', 'hidden');
	}

	wrap() {
		let self = this;

		let maxWidth = parseInt(this.svg.attr('width'));
		let textWidth = function(selector) {
			let text = d3.select(selector).node().textLength.baseVal.value;
			return text;
		};

		let phrase = self.emptyText.node().innerHTML;
		let secondLine = [];

		while (textWidth('#bar1-emptyText') > maxWidth * 0.8) {
			let splitPhrase = phrase.split(' ');
			let remove = splitPhrase[splitPhrase.length - 1];
			secondLine.push(remove);
			phrase = phrase.replace(remove, '').slice(0, -1);
			self.emptyText.text(phrase);
			self.emptyText2.text(secondLine.reverse().join(' '));
		}
	}
}
