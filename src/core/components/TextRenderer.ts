import { CompareMode, Font } from "love.graphics";
import { Component } from "./Component";

export class TextRenderer extends Component {

	str: string;
	font?: Font;
	width = 100;
	originX = 0;
	originY = 0;
	color = { r: 1, g: 1, b: 1, a: 1 };
	// stencil: [CompareMode, number] = ["always", 1];
	stencil?: "black" | "white";

	debugBounds = false;

	create(str: string, width: number, font?: Font) {
		this.str = str;
		this.width = width;
		this.font = font;
	}

	setColor(r: number, g: number, b: number, a?: number) {
		this.color.r = r;
		this.color.g = g;
		this.color.b = b;
		if (a) this.color.a = a;
	}

	get alpha() {return this.color.a;}
	set alpha(val: number) {
		this.color.a = val;
	}

	setBlackStencil(): void {
		this.stencil = "black";
	}

	setWhiteStencil(): void {
		this.stencil = "white";
	}

	draw(bounds?: Rect) {
		let a, b = love.graphics.getStencilTest();
		let compareMode = <unknown>a as CompareMode;
		let compareValue = <unknown>b as number;
		let s = this.stencil;
		if (s == null) {
			if (compareMode != "always") love.graphics.setStencilTest();
		} else {
			let mode: CompareMode = (this.stencil == "black") ? "equal" : "less";
			let value = 1;
			if (compareMode != mode || compareValue != value) love.graphics.setStencilTest(mode, value);
		}
		this.drawInner(bounds);
	}

	drawInner(bounds?: Rect) {

		love.graphics.setColor(this.color.r, this.color.g, this.color.b, this.color.a);

		// let b = this.getRenderBounds();
		// if (bounds && (b.left > bounds.x + bounds.width || b.right < bounds.x || b.top > bounds.y + bounds.height || b.bottom < bounds.y)) {
		// 	return;
		// }

		love.graphics.push();
		love.graphics.applyTransform(this.obj.transform.globalMatrix);
		// this.quadMode.draw(this);
		let height = 0;
		if (this.font) {
			love.graphics.setFont(this.font);
			let [width, tbl] = this.font.getWrap(this.str, this.width);
			height = tbl.length * this.font.getHeight();
		}
		love.graphics.printf(this.str, -this.width / 2, -height / 2, this.width, "center");
		love.graphics.pop();
	}

	// get width() {
	// 	return this.quadMode.width;
	// }

	// get height() {
	// 	return this.quadMode.height;
	// }

	setOrigin(x: number, y?: number) {
		if (y == null) y = x;
		this.originX = x;
		this.originY = y;
	}

	// getRenderBounds() {
	// 	let scale = Math.max(this.obj.transform.globalScaleX, this.obj.transform.globalScaleY);
	// 	let size = Math.sqrt(this.width * this.width + this.height * this.height);
	// 	let originX = Math.max(this.originX, 1 - this.originX);
	// 	let originY = Math.max(this.originY, 1 - this.originY);
	// 	let origin = Math.max(originX, originY);
	// 	let pos = this.obj.transform.globalPosition;
	// 	let maxSize = scale * size * origin;
	// 	return {left: pos.x - maxSize, top: pos.y - maxSize, right: pos.x + maxSize, bottom: pos.y + maxSize};
	// }

	// pointInBounds(x: number, y: number) {
	// 	let [nx, ny] = this.obj.transform.globalMatrix.inverseTransformPoint(x, y);
	// 	nx += this.originX * this.width;
	// 	ny += this.originY * this.height;
	// 	return (nx >= 0 && nx <= this.width && ny >= 0 && ny <= this.height);
	// }

}