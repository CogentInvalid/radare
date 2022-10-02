import { Component } from "core/components/Component";
import { InputSystem } from "core/systems/InputSystem";

export class TopDownController extends Component {

	speed = 350;
	vx = 0;
	vy = 0;

	update(dt: number) {
		let transform = this.obj.transform;
		
		const input = this.scene.getSystem(InputSystem);
		let dir = { x: 0, y: 0 };
		if (input) {
			if (input.down("up")) dir.y -= 1;
			if (input.down("down")) dir.y += 1;
			if (input.down("left")) dir.x -= 1;
			if (input.down("right")) dir.x += 1;
		}

		// normalize dir
		let len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
		if (len > 0) {
			dir.x /= len;
			dir.y /= len;
		}

		this.vx -= (this.vx - dir.x * this.speed) * 8 * dt;
		this.vy -= (this.vy - dir.y * this.speed) * 8 * dt;

		transform.x += this.vx * dt;
		transform.y += this.vy * dt;
	}

}