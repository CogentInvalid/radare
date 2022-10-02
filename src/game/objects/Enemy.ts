import { ImageRenderer } from "core/components/ImageRenderer";
import { PhysicsBody } from "core/components/PhysicsBody";
import { GameObject } from "core/objects/GameObject";
import { PhysType } from "game/CollisionMap";
import { FaceTarget } from "game/components/FaceTarget";
import { ShootAI } from "game/components/ShootAI";
import { SideListener } from "game/components/SideListener";
import { GameScene } from "game/scenes/GameScene";
import { Bullet } from "./Bullet";

export class Enemy extends GameObject {

	scene: GameScene;
	object?: GameObject;

	active = false;

	constructor(scene: GameScene) {
		super(scene);

		let image = this.addComponent(ImageRenderer, "enemy");
		image.setOrigin(0.5, 0.5);
		image.setWhiteStencil();

		let sideListener = this.addComponent(SideListener, 50);
		sideListener.onChanged.add((side) => {
			if (side == 1) this.getComponent(ShootAI).resetTimer();
		});

		this.addComponent(PhysicsBody, PhysType.ENEMY, 4, 4, -2, -2, false, false);

		let center = { x: love.graphics.getWidth() / 2, y: love.graphics.getHeight() / 2 };
		let target = lume.randomchoice([scene.player.transform, center]);
		this.addComponent(FaceTarget, target);
		this.addComponent(ShootAI);
	}

	update(dt: number): void {
		this.active = !this.getComponent(SideListener).touchingWhite;
		super.update(dt);
	}

	shoot(): void {
		this.scene.assets.sound("shoot").stop();
		this.scene.assets.sound("shoot").play();
		let dx = math.cos(this.transform.angle);
		let dy = math.sin(this.transform.angle);
		let bullet = this.scene.add(Bullet, this.scene);
		bullet.transform.setPosition(this.transform.x + 13 * dx, this.transform.y + 13 * dy);
		let s = 250;
		bullet.phys.setVelocity(dx * s, dy * s);
	}

}