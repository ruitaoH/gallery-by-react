require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');

//获取图片相关数据
var imageData = require("../data/imageData.json")

//通过自执行函数,将图片名信息转换成图片URL路径信息
imageData = (function(imageDataArr) {
	for(let i = 0;i < imageDataArr.length;i++){
		let singleImageData = imageDataArr[i];

		singleImageData.imageURL = require("../images/" + singleImageData.fileName);

		imageDataArr[i] = singleImageData;
	}

	return imageDataArr;
})(imageData);

// class AppComponent extends React.Component {
//   render() {
//     return (
//       <div className="index">
//         // <img src={yeomanImage} alt="Yeoman Generator" />
//         <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
//       </div>
//     );
//   }
// }

var ImageFigure = React.createClass({
	handleClick : function(e){

		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},

	render : function(){
		var styleObj = {};

		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}

		// if(this.props.arrange.rotate){
		// 	(['-moz-','-ms-','-webkit-','']).forEach(function(value){
		// 		styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
		// 	}.bind(this));
		// }
		if(this.props.arrange.rotate){
			(["MozTransform","msTransform","WebkitTransform","transform"]).forEach(function(value){
				styleObj[value] = "rotate(" + this.props.arrange.rotate + "deg)";
			}.bind(this));
		}

		var imgFigureClassName = "img-figure";

		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
})

class AppComponent extends React.Component{
	// this.Constant : {
	// 	centerPos : {
	// 		left : 0,
	// 		right : 0
	// 	},
	// 	hPosRange : {
	// 		leftSecX : [0,0],
	// 		rightSecX : [0 , 0],
	// 		y : [0,0]
	// 	},
	// 	vPosRange : {
	// 		x : [0 ,0],
	// 		topY:[0,0]
	// 	}
	// }
	constructor(props){
		super(props);

		this.constant = {
			centerPos : {
				left : 0,
				top : 0
			},
			hPosRange : {
				leftSecX : [0,0],
				rightSecX : [0 , 0],
				y : [0,0]
			},
			vPosRange : {
				x : [0 ,0],
				topY:[0,0]
			}
		};

		this.state = {
			imgsArrangeArr : [
				/*{
					pos:{
						left :,
						right:
					},
					rotate : ,
					isInverse : false ---> 正反面 false正面,
					isCenter : false
				}*/
			]
		}
	}

	// 翻转图片
	inverse(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr : imgsArrangeArr
			});
		}.bind(this);
	}

	// getInitialState(){
	// 	return {
	// 		imgsArrangeArr : []
	// 	};
	// } ---> 只能用在createClass时

	componentDidMount(){
		// var stageDom = React.findDOMNode(this.refs.stage),
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//拿到一个imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		//计算中心图片的位置点
		this.constant.centerPos = {
			left : halfStageW - halfImgW,
			top : halfStageH - halfImgH
		};

		//计算左侧水平位置范围
		this.constant.hPosRange.leftSecX[0] = -halfImgW;
		this.constant.hPosRange.leftSecX[1] = halfStageW - 3 * halfImgW;

		//计算右侧水平位置范围
		this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		//计算纵坐标范围
		this.constant.hPosRange.y[0] = -halfImgH;
		this.constant.hPosRange.y[1] = stageH - halfImgH;

		//计算上分区
		this.constant.vPosRange.topY[0] = -halfImgH;
		this.constant.vPosRange.topY[1] = halfStageH - 3 * halfImgH;
		this.constant.vPosRange.x[0] = halfStageW - imgW;
		this.constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	}

	center(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	}

	/*
	* 重新布局所有图片
	* @param 指定 居中哪个图片
	*/
	rearrange(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			constant = this.constant,
			centerPos = constant.centerPos,
			hPosRange = constant.hPosRange,
			vPosRange = constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeX = vPosRange.x,
			vPosRangeTopY = vPosRange.topY,
			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), // ---> 上侧放0 或 1 个图片
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			//首先居中centerIndex的图片
			// imgsArrangeCenterArr[0].pos = centerPos;
			// imgsArrangeCenterArr[0].rotate = 0;
			// imgsArrangeCenterArr[0].isInverse = false;

			imgsArrangeCenterArr[0] = {
				pos : centerPos,
				rotate : 0,
				isInverse : false,
				isCenter : true
			};

			//取出上侧的图片
			topImgSpliceIndex = Math.ceil((imgsArrangeArr.length - topImgNum) * Math.random());
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

			//布局上侧图片
			/*
				{
					pos:{
						left:,
						top:
					},
					rotate :
				}
			*/
			imgsArrangeTopArr.forEach(function(value,index){
				imgsArrangeTopArr[index] = {
					pos : {
						left:this.getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
						top:this.getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
					},
					rotate : this.get30DegRamdom(),
					isInverse : false,
					isCenter : false
				};
			}.bind(this));

			//布局左右两侧的图片
			for(let i = 0,j = imgsArrangeArr.length,k = j / 2;i < j;i++){
				var hPosRangeLORX = null;

				if(i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos : {
						left : this.getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
						top : this.getRangeRandom(hPosRangeY[0],hPosRangeY[1])
					},
					rotate : this.get30DegRamdom(),
					isInverse : false,
					isCenter : false
				};
			}

			//把上部元素插回去
			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
			}

			//把中间元素插回去
			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr : imgsArrangeArr
			})
	}

	getRangeRandom(low,high){
		return Math.ceil(Math.random() * (high - low) + low);
	}

	get30DegRamdom(){
		return ((Math.random > 0.5 ? '+' : '-') + Math.ceil(Math.random() * 30));
	}

    	render() {
		var imageFigures = [],
			controllerUnits = [];

		imageData.forEach(function(image,index){
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos : {
						left : 0,
						top : 0
					},
					rotate : 0
				};
			}

			imageFigures.push(<ImageFigure data={image} arrange={this.state.imgsArrangeArr[index]} key={index} ref={"imgFigure" + index} inverse={this.inverse(index)} center={this.center(index)} />);

			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)} />);
		}.bind(this));

        	return (
        		<section className="stage" ref="stage">
        			<section className="img-sec">
        			 	{imageFigures}
        			</section>

        			<nav className="controller-nav">
        				{controllerUnits}
        			</nav>
        		</section>
        	);
    	}
}

//控制组件
var ControllerUnit = React.createClass({
	handleClick : function(e){
		//如果点击的是当前正是居中态的图片
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},

	render : function(){
		var controllerUnitClassName = "controller-unit";

		// 如果对应的是居中的图片
		if(this.props.arrange.isCenter){
			controllerUnitClassName += " is-center";

			// 如果同时对应的是图片的翻转态
			if(this.props.arrange.isInverse){
				controllerUnitClassName += " is-inverse";
			}
		}

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}>

			</span>
		);
	}
})

AppComponent.defaultProps = {
};

export default AppComponent;
