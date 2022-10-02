import { Component } from "core/components/Component";

export class FaceTarget extends Component {

	target: { x: number, y: number };

	create(target: {x: number, y: number}): void {
		this.target = target;
	}

	update(dt: number): void {
		let transform = this.obj.transform;
		let angle = lume.angle(transform.x, transform.y, this.target.x, this.target.y);
		transform.angle = angle;
	}

}