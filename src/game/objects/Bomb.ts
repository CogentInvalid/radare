import { ImageRenderer } from "core/components/ImageRenderer";
import { TextRenderer } from "core/components/TextRenderer";
import { Easing } from "core/Easing";
import { GameObject } from "core/objects/GameObject";
import { CameraManager } from "core/systems/CameraManager";
import { SideListener } from "game/components/SideListener";
import { GameScene } from "../scenes/GameScene";
import { Enemy } from "./Enemy";
import { Explosion } from "./Explosion";
import { ExplosionMarker } from "./ExplosionMarker";

export class Bomb extends GameObject {

	scene: GameScene;
	timer = 10;

	text: TextRenderer[];

	constructor(scene: GameScene) {
		super(scene);

		const whiteImg = this.addComponent(ImageRenderer, "bomb");
		whiteImg.setOrigin(0.5);
		whiteImg.setWhiteStencil();

		const wt = this.addChild(scene.addObject());
		// wt.transform.y = -8;
		const whiteText = wt.addComponent(TextRenderer, "9", 100, scene.font);
		whiteText.setWhiteStencil();

		const blackImg = this.addComponent(ImageRenderer, "bomb");
		blackImg.setColor(0, 0, 0);
		blackImg.setOrigin(0.5);
		blackImg.setBlackStencil();

		const bt = this.addChild(scene.addObject());
		// bt.transform.y = -8;
		const blackText = bt.addComponent(TextRenderer, "9", 100, scene.font);
		blackText.setColor(0, 0, 0);
		blackText.setBlackStencil();

		this.text = [whiteText, blackText];

		this.transform.scale = 0;
		this.addTween({
			targets: this.transform,
			props: { scale: 1 },
			duration: 0.2,
			ease: Easing.QuadOut,
		});
	}

	update(dt: number): void {
		super.update(dt);

		let prevTimer = this.timer;
		this.timer -= dt;
		this.text.forEach(t => t.str = math.ceil(this.timer) + "");
		if (math.ceil(prevTimer) != math.ceil(this.timer) && this.timer > 0) {
			this.scene.assets.sound(this.timer <= 1 ? "tick2" : "tick1").stop();
			this.scene.assets.sound(this.timer <= 1 ? "tick2" : "tick1").play();
		}
		if (prevTimer >= 1 && this.timer < 1) {
			this.showMarker();
		}
		if (this.timer <= 0) {
			this.explode();
		}
	}

	showMarker(): void {
		let marker = this.scene.add(ExplosionMarker, this.scene);
		marker.transform.setPosition(this.transform.x, this.transform.y);
	}

	explode(): void {
		this.scene.assets.sound("explosion").stop();
		this.scene.assets.sound("explosion").play();
		this.scene.getSystem(CameraManager).setScreenShake(0.2);
		
		let explosion = this.scene.add(Explosion, this.scene);
		explosion.transform.setPosition(this.transform.x, this.transform.y);

		let enemies = this.scene.findObjectsOfType(Enemy);
		enemies = enemies.filter(enemy => {
			let inRange = lume.distance(enemy.transform.x, enemy.transform.y, this.transform.x, this.transform.y) <= (350 / 2);
			let visible = enemy.getComponent(SideListener).touchingBlack;
			return inRange && visible;
		});
		enemies.forEach(e => e.destroy());

		let players = [this.scene.player, this.scene.mirrorPlayer];
		players = players.filter(p => lume.distance(p.transform.x, p.transform.y, this.transform.x, this.transform.y) <= (320 / 2));
		players.forEach(p => p.explode());

		this.destroy();
	}
}