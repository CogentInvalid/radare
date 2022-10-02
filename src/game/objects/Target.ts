import { ImageRenderer } from "core/components/ImageRenderer";
import { PhysicsBody } from "core/components/PhysicsBody";
import { Easing } from "core/Easing";
import { GameObject } from "core/objects/GameObject";
import { PhysType } from "game/CollisionMap";
import { SideListener } from "game/components/SideListener";
import { DeathMarker } from "game/objects/DeathMarker";
import { GameScene } from "game/scenes/GameScene";

export class Target extends GameObject {

	scene: GameScene;
	hasNode = false;
	deadImage: ImageRenderer;

	constructor(scene: GameScene) {
		super(scene);

		let image = this.addComponent(ImageRenderer, "target");
		image.setOrigin(0.5, 0.5);
		image.setColor(0, 0, 0);
		image.setBlackStencil();

		this.addComponent(PhysicsBody, PhysType.WALL, 20, 20, -20 / 2, -20 / 2, true, false);

		const sideListener = this.addComponent(SideListener, 50);
		sideListener.onChanged.add((side) => {
			if (side == 1 && !this.hasNode) {
				this.addDeadImage();
			}
			if (side == 0) {
				if (!this.hasNode) this.fail();
				else this.destroy();
			}
		});

	}

	update(dt: number): void {
		super.update(dt);
		if (this.hasNode && this.deadImage) this.deadImage.destroy();
	}

	addDeadImage(): void {
		const dead = this.deadImage = this.addComponent(ImageRenderer, "dead");
		dead.setOrigin(0.5);
		dead.setWhiteStencil();
	}

	addNode(): void {
		this.hasNode = true;
		let node = this.scene.addImage("node");
		this.addChild(node);
		node.setOrigin(0.5, 0.5);
		node.setColor(0, 0, 0);
		node.image.setBlackStencil();
		node.transform.scale = 0;
		node.addTween({
			targets: node.transform,
			props: { scale: 1 },
			duration: 0.15,
			ease: Easing.QuadOut,
		});
		if (this.deadImage) this.deadImage.destroy();
	}

	fail(): void {
		this.destroy();
		let ourMarker = this.scene.add(DeathMarker, this.scene);
		ourMarker.transform.setPosition(this.transform.x, this.transform.y);
		this.scene.onDeath("target");
	}

}