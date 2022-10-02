import { ImageRenderer } from "core/components/ImageRenderer";
import { GameObject } from "core/objects/GameObject";
import { Scene } from "core/Scene";

export class ExplosionMarker extends GameObject {
	constructor(scene: Scene) {
		super(scene);

		const whiteImg = this.addComponent(ImageRenderer, "explosion-circle");
		whiteImg.setOrigin(0.5);
		whiteImg.setWhiteStencil();
		whiteImg.alpha = 0;

		const blackImg = this.addComponent(ImageRenderer, "explosion-circle");
		blackImg.setColor(0, 0, 0);
		blackImg.setOrigin(0.5);
		blackImg.setBlackStencil();
		blackImg.alpha = 0;

		this.transform.scale = 1.1;
		this.addTween({
			targets: this.transform,
			props: { scale: 1 },
			duration: 1,
		});

		this.addTween({
			targets: [whiteImg, blackImg],
			props: { alpha: 1 },
			duration: 1,
			onComplete: () => this.destroy(),
		});
	}
}