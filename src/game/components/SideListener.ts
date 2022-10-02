import { Component } from "core/components/Component";
import { Event } from "core/Event";
import { GameScene } from "game/scenes/GameScene";

export class SideListener extends Component {
	scene: GameScene;
	objSize: number;
	side: 0 | 1;
	touchingBlack = false;
	touchingWhite = false;
	offset = 0;
	onChanged: Event<number> = new Event();

	create(size: number): void {
		this.objSize = size;
	}

	update() {
		let [cx, cy] = this.scene.getCenter();

		let t = this.obj.transform;
		let s = this.objSize / 2;
		let pts = [[t.x - s, t.y - s], [t.x - s, t.y + s], [t.x + s, t.y - s], [t.x + s, t.y + s]];
		
		let sides = pts.map(([x, y]) => {
			let angle1 = this.scene.spinner.transform.angle + this.offset;
			let angle2 = Math.atan2(y - cy, x - cx);
			let diff = angle2 - angle1;
			let dist = diff = (diff + Math.PI) % (Math.PI * 2) - Math.PI;
			return (Math.abs(dist) < Math.PI / 2) ? 0 : 1;
		});

		// let angle1 = this.scene.spinner.transform.angle + this.offset;
		// let angle2 = Math.atan2(this.obj.transform.y - cy, this.obj.transform.x - cx);
		// let diff = angle2 - angle1;
		// let dist = diff = (diff + Math.PI) % (Math.PI * 2) - Math.PI;

		let prevSide = this.side;

		this.touchingBlack = sides.some(s => s == 0);
		this.touchingWhite = sides.some(s => s == 1);
		if (sides.every(s => s == 0)) this.side = 0;
		if (sides.every(s => s == 1)) this.side = 1;

		// if (Math.abs(dist) < Math.PI / 2) this.side = 0;
		// else this.side = 1;

		if (prevSide != null && prevSide != this.side) {
			this.onChanged.emit(this.side);
		}
	}
}