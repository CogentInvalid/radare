import { ImageRenderer } from "core/components/ImageRenderer";
import { GameObject } from "core/objects/GameObject";
import { Scene } from "core/Scene";

export class Explosion extends GameObject {
	constructor(scene: Scene) {
		super(scene);

		const whiteImg = this.addComponent(ImageRenderer, "explosion");
		whiteImg.setOrigin(0.5);
		whiteImg.setWhiteStencil();

		const blackImg = this.addComponent(ImageRenderer, "explosion");
		blackImg.setColor(0, 0, 0);
		blackImg.setOrigin(0.5);
		blackImg.setBlackStencil();

		this.transform.angle = love.math.random() * math.pi * 2;

		this.addTween({
			targets: this.transform,
			props: { scale: 1.5 },
			duration: 0.3,
		});

		this.addTween({
			targets: [whiteImg.color, blackImg.color],
			props: { a: 0 },
			duration: 0.3,
			onComplete: () => this.destroy(),
		})
	}
}