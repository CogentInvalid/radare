import { Component } from "core/components/Component";
import { ImageRenderer } from "core/components/ImageRenderer";
import { Enemy } from "game/objects/Enemy";

export class ShootAI extends Component {

	obj: Enemy;
	shootTimer: number;
	time = 3;

	create(): void {
		this.shootTimer = this.time;
	}

	update(dt: number): void {
		if (!this.obj.active) return;

		let prevTimer = this.shootTimer;
		this.shootTimer -= dt;
		if (prevTimer >= 0.4 && this.shootTimer < 0.4) {
			this.preFire();
		}
		if (this.shootTimer <= 0) {
			this.obj.shoot();
			this.shootTimer += this.time;
		}
	}

	resetTimer() {
		this.shootTimer = this.time;
	}

	preFire() {
		let dotObj = this.scene.addObject();
		this.obj.addChild(dotObj);
		let dot = dotObj.addComponent(ImageRenderer, "enemy-dot");
		dot.setColor(1, 1, 1);
		dot.setWhiteStencil();
		dot.setOrigin(0.5);
		// let enemy = this.obj;
		// dotObj.addComponent(class extends Component {
		// 	update(dt: number) {
		// 		// error("please");
		// 		// this.obj.transform.angle = enemy.transform.angle;
		// 	}
		// });

		dotObj.addTimer(0.1, () => dot.alpha = 0);
		dotObj.addTimer(0.2, () => dot.alpha = 1);
		dotObj.addTimer(0.3, () => dot.alpha = 0);
		dotObj.addTimer(0.4, () => dotObj.destroy());
	}

}