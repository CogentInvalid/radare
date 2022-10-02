import { ImageRenderer } from "core/components/ImageRenderer";
import { PhysicsBody } from "core/components/PhysicsBody";
import { Easing } from "core/Easing";
import { GameObject } from "core/objects/GameObject";
import { PhysType } from "game/CollisionMap";
import { SideListener } from "game/components/SideListener";
import { GameScene } from "../scenes/GameScene";

export class BombPickup extends GameObject {

	constructor(scene: GameScene) {
		super(scene);

		const img = this.addComponent(ImageRenderer, "bomb-pickup");
		img.setColor(0, 0, 0);
		img.setOrigin(0.5);
		img.setBlackStencil();

		let sideListener = this.addComponent(SideListener, 50);
		sideListener.onChanged.add((side) => {
			if (side == 0) this.destroy();
		});

		this.addComponent(PhysicsBody, PhysType.WALL, 16, 16, -16 / 2, -16 / 2, true, false);
	}

	remove() {
		this.getComponent(PhysicsBody).destroy();
		this.addTween({
			targets: this.transform,
			props: { scale: 0 },
			duration: 0.15,
			ease: Easing.QuadIn,
			onComplete: () => this.destroy(),
		});
	}
}