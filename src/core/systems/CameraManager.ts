import { Scene } from "core/Scene";
import { Transform } from "core/Transform";
import { System } from "./System";

export class CameraManager extends System {

	x = 0;
	y = 0;
	scale = 1;
	rot = 0;
	screenShake = 0;

	target: {x: number, y: number};

	constructor(scene: Scene) {
		super(scene);
	}

	setTarget(target: {x: number, y: number}, teleportToTarget = false) {
		this.target = target;
		if (teleportToTarget) {
			this.x = this.target.x;
			this.y = this.target.y;
		}
	}

	update(dt: number) {
		if (this.target) {
			this.x -= (this.x - this.target.x) * 8 * dt;
			this.y -= (this.y - this.target.y) * 8 * dt;
		}

		let ox = 0; let oy = 0;
		if (this.screenShake > 0) {
			ox = (love.math.random() - 0.5) * 10000 * this.screenShake * dt;
			oy = (love.math.random() - 0.5) * 10000 * this.screenShake * dt;
			this.screenShake -= dt;
		}
		this.x += ox;
		this.y += oy;
	}

	attach() {
		let cx = love.graphics.getWidth() / (2 * this.scale);
		let cy = love.graphics.getHeight() / (2 * this.scale);
		love.graphics.push();
		love.graphics.scale(this.scale);
		let x = lume.round(cx - this.x, 1);
		let y = lume.round(cy - this.y, 1);
		love.graphics.translate(x, y);
		love.graphics.rotate(this.rot);
	}

	detach() {
		love.graphics.pop();
	}

	getWorldBounds(): Rect {
		// TODO: doesn't factor in camera scale
		let [w, h] = love.graphics.getDimensions();
		return {x: this.x - w / 2, y: this.y - h / 2, width: w, height: h};
	}

	getWorldPos(sx: number, sy: number): [number, number] {
		let [w, h] = love.graphics.getDimensions();
		let transform = love.math.newTransform(this.x - w / 2, this.y - h / 2, this.rot, this.scale, this.scale);
		return transform.transformPoint(sx, sy);
	}

	setScreenShake(amt: number) {
		this.screenShake = amt;
	}

}