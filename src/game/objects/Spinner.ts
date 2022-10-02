import { Component } from "core/components/Component";
import { ImageRenderer } from "core/components/ImageRenderer";
import { GameObject } from "core/objects/GameObject";
import { GameScene } from "game/scenes/GameScene";

export class Spinner extends GameObject {

	whiteSide: ImageRenderer;

	constructor(scene: GameScene) {
		super(scene);
		
		let whiteSide = this.whiteSide = this.addComponent(ImageRenderer, "whiteSquare");
		whiteSide.setOrigin(1, 0.5);
		let blackSide = this.addComponent(ImageRenderer, "whiteSquare");
		blackSide.setOrigin(0, 0.5);
		blackSide.setColor(0, 0, 0);

		this.transform.angle = Math.PI / 2;

		this.transform.setScale(30);
		this.addComponent(class extends Component {
			update(dt: number) {
				let speed = 1;
				if (love.keyboard.isScancodeDown("f")) speed = 3;
				this.obj.transform.angle += speed * Math.PI / 10 * dt;
			}
		});
	}

	draw(bounds?: Rect): void {
		love.graphics.stencil(() => {
			this.whiteSide.draw();
		}, "replace", 1);
		super.draw(bounds);
	}
}