import { ImageRenderer } from "core/components/ImageRenderer";
import { Easing } from "core/Easing";
import { GameObject } from "core/objects/GameObject";
import { GameScene } from "../scenes/GameScene";

export class DeathMarker extends GameObject {
	constructor(scene: GameScene) {
		super(scene);

		const whiteX = this.addComponent(ImageRenderer, "dead");
		whiteX.setOrigin(0.5);
		whiteX.setWhiteStencil();

		const blackX = this.addComponent(ImageRenderer, "dead");
		blackX.setColor(0, 0, 0);
		blackX.setOrigin(0.5);
		blackX.setBlackStencil();

		this.addTween({
			targets: this.transform,
			props: { scale: 1.2 },
			duration: 0.3,
			yoyo: true,
			repeat: -1,
			ease: Easing.QuadOut,
		})
	}
}