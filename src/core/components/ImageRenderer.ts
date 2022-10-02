import { CompareMode, FilterMode, Image, Quad } from "love.graphics";
import { Component } from "./Component";

export class ImageRenderer extends Component {

	imageKey: string;
	image: Image;
	quadMode: QuadMode;
	originX = 0;
	originY = 0;
	color = { r: 1, g: 1, b: 1, a: 1 };
	// stencil: [CompareMode, number] = ["always", 1];
	stencil?: "black" | "white";

	debugBounds = false;

	create(imageKey: string) {
		this.imageKey = imageKey;
		this.image = this.scene.assets.img(imageKey);
		this.quadMode = new NoQuadMode(this.image);
	}

	setFilter(min: FilterMode, mag?: FilterMode) {
		this.image.setFilter(min, mag ? mag : min);
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

	setTileQuad(tileSize: number, index: number) {
		let quad = ImageRenderer.createTileQuad(index, tileSize, tileSize, this.image.getWidth(), this.image.getHeight());
		this.setQuad(quad);
	}

	setQuad(quad: Quad) {
		this.quadMode = new HasQuadMode(this.image, quad);
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

		let b = this.getRenderBounds();
		if (bounds && (b.left > bounds.x + bounds.width || b.right < bounds.x || b.top > bounds.y + bounds.height || b.bottom < bounds.y)) {
			return;
		}

		love.graphics.push();
		love.graphics.applyTransform(this.obj.transform.globalMatrix);
		this.quadMode.draw(this);
		love.graphics.pop();

		if (this.debugBounds) {
			love.graphics.setColor(1, 0, 0, 0.2);
			let w = b.right - b.left;
			let h = b.bottom - b.top;
			love.graphics.rectangle("fill", b.left, b.top, w, h);

			// let s = this.obj.transform.scale;
			love.graphics.setColor(1, 1, 1);
			let r = n => Math.round(b[n]);
			love.graphics.print(r("top") + ", " + r("left") + "\n" + r("bottom") + ", " + r("right"), b.left, b.top, 0, 1, 1);
		}
	}

	get width() {
		return this.quadMode.width;
	}

	get height() {
		return this.quadMode.height;
	}

	setOrigin(x: number, y?: number) {
		if (y == null) y = x;
		this.originX = x;
		this.originY = y;
	}

	getRenderBounds() {
		let scale = Math.max(this.obj.transform.globalScaleX, this.obj.transform.globalScaleY);
		let size = Math.sqrt(this.width * this.width + this.height * this.height);
		let originX = Math.max(this.originX, 1 - this.originX);
		let originY = Math.max(this.originY, 1 - this.originY);
		let origin = Math.max(originX, originY);
		let pos = this.obj.transform.globalPosition;
		let maxSize = scale * size * origin;
		return {left: pos.x - maxSize, top: pos.y - maxSize, right: pos.x + maxSize, bottom: pos.y + maxSize};
	}

	pointInBounds(x: number, y: number) {
		let [nx, ny] = this.obj.transform.globalMatrix.inverseTransformPoint(x, y);
		nx += this.originX * this.width;
		ny += this.originY * this.height;
		return (nx >= 0 && nx <= this.width && ny >= 0 && ny <= this.height);
	}

	public static createTileQuad(id: number, tileWidth: number, tileHeight: number, imgWidth: number, imgHeight: number) {
		let x = 0; let y = 0;
		id = tonumber(id);
		let tilesX = Math.floor(imgWidth / tileWidth);
		while (id >= tilesX) {
			id = id - tilesX;
			y = y + 1;
		}
		x = x + id;
		return love.graphics.newQuad(x * tileWidth, y * tileHeight, tileWidth, tileHeight, imgWidth, imgHeight);
	}

}

abstract class QuadMode {
	img: Image;
	constructor(img: Image) {this.img = img;}
	abstract get width(): number;
	abstract get height(): number;
	abstract draw(img: ImageRenderer): void;
}

class NoQuadMode extends QuadMode {
	get width() {
		return this.img.getWidth();
	}
	get height() {
		return this.img.getHeight();
	}
	draw(img: ImageRenderer) {
		love.graphics.draw(this.img, 0, 0, 0, 1, 1, img.originX * this.width, img.originY * this.height);
	}
}

class HasQuadMode extends QuadMode {
	quad: Quad;
	constructor(img: Image, quad: Quad) {
		super(img);
		this.quad = quad;
	}
	get width() {
		return this.quad.getViewport()[2];
	}
	get height() {
		return this.quad.getViewport()[3];
	}
	draw(img: ImageRenderer) {
		love.graphics.draw(this.img, this.quad, 0, 0, 0, 1, 1, img.originX * this.width, img.originY * this.height);
	}
}