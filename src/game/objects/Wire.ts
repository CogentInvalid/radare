import { ImageRenderer } from "core/components/ImageRenderer";
import { Easing } from "core/Easing";
import { GameObject } from "core/objects/GameObject";
import { GameScene } from "game/scenes/GameScene";

export class Wire extends GameObject {

	image: ImageRenderer;
	start: GameObject;
	end: GameObject;
	lengthScale = 1;
	startAtEnd = false;

	constructor(scene: GameScene) {
		super(scene);

		this.image = this.addComponent(ImageRenderer, "whiteSquare");
		this.image.setOrigin(0, 0.5);
		this.image.setColor(0, 0, 0);
		this.image.setBlackStencil();

		this.transform.setScale(2, 5 / this.image.height);
	}

	setStart(start: GameObject): void {
		this.start = start;
		const transform = start.transform;
		this.transform.setPosition(transform.x, transform.y);
	}

	setEnd(end: GameObject): void {
		this.end = end;
	}

	update(dt: number): void {
		if (this.start.pendingDestroy && this.end.pendingDestroy) this.destroy();
		super.update(dt);
	}

	draw(): void {
		if (this.end) {
			if (!this.startAtEnd) {
				const end = this.end.transform;
				this.transform.angle = lume.angle(this.transform.x, this.transform.y, end.x, end.y);
				let dist = lume.distance(this.transform.x, this.transform.y, end.x, end.y) * this.lengthScale;
				this.transform.scaleX = dist / this.image.width;
			}
			else {
				const start = this.start.transform;
				const end = this.end.transform;
				this.transform.setPosition(end.x, end.y);
				this.transform.angle = lume.angle(this.transform.x, this.transform.y, start.x, start.y);
				let dist = lume.distance(this.transform.x, this.transform.y, start.x, start.y) * this.lengthScale;
				this.transform.scaleX = dist / this.image.width;
			}
		}
		super.draw();
	}

	remove(): void {
		this.startAtEnd = true;
		this.addTween({
			targets: this,
			props: { lengthScale: 0 },
			duration: 0.5,
			ease: Easing.QuadOut,
			onComplete: () => this.destroy(),
		});
	}

	setLengthScale(scale: number): void {
		if (this.end) {
			const end = this.end.transform;
			let dist = lume.distance(this.transform.x, this.transform.y, end.x, end.y) * scale;
			this.transform.scaleX = dist / this.image.width;
		}
	}

}