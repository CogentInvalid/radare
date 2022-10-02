import { Component } from "core/components/Component";
import { PhysicsBody } from "core/components/PhysicsBody";
import { Easing } from "core/Easing";
import { CameraManager } from "core/systems/CameraManager";
import { CollisionManager } from "core/systems/CollisionManager";
import { InputSystem } from "core/systems/InputSystem";
import { PhysType } from "game/CollisionMap";
import { BombComponent } from "game/components/BombComponent";
import { SideListener } from "game/components/SideListener";
import { TopDownController } from "game/components/TopDownController";
import { DeathMarker } from "game/objects/DeathMarker";
import { GameScene } from "game/scenes/GameScene";
import { ImageRenderer } from "../../core/components/ImageRenderer";
import { GameObject } from "../../core/objects/GameObject";
import { BombPickup } from "./BombPickup";
import { Bullet } from "./Bullet";
import { Target } from "./Target";
import { Wire } from "./Wire";

export class Player extends GameObject {

	scene: GameScene;
	wire: Wire;
	imgObject: GameObject;

	constructor(scene: GameScene) {
		super(scene);

		this.imgObject = this.addChild(scene.addObject());
		const image = this.imgObject.addComponent(ImageRenderer, "player");
		image.setOrigin(0.5);
		image.setColor(0, 0, 0);
		image.setBlackStencil();

		const dead = this.addComponent(ImageRenderer, "dead");
		dead.setOrigin(0.5);
		dead.setWhiteStencil();

		let controller = this.addComponent(TopDownController);
		let size = 50;
		if (this.scene.getSystem(CollisionManager)) {
			let phys = this.addComponent(PhysicsBody, PhysType.PLAYER, size, size, -size / 2, -size / 2, false, false);
			phys.onCollide.add(this.onCollide, this);
		}

		// this.addComponent(class extends Component {
		// 	update(dt: number) {
		// 		let cam = this.scene.getSystem(CameraManager);
		// 		if (!cam) return;
		// 		let [sx, sy] = love.mouse.getPosition();
		// 		let [wx, wy] = cam.getWorldPos(sx, sy);
		// 		let ang = Math.atan2(wy - this.obj.transform.y, wx - this.obj.transform.x);
		// 		this.obj.transform.angle = ang;
		// 	}
		// });

		const sideListener = this.addComponent(SideListener, 50);
		sideListener.onChanged.add((side) => {
			if (side == 0) this.offSide();
		});

		this.addComponent(BombComponent);

		let input = this.scene.getSystem(InputSystem);
		input?.actions["use"].onPressed.add(this.spawnBomb, this);
	}

	destroy(): void {
		if (this.wire) this.wire.remove();
		let input = this.scene.getSystem(InputSystem);
		input?.actions["use"].onPressed.remove(this.spawnBomb, this);
		super.destroy();
	}

	onCollide(cols: CollisionTable<PhysicsBody>[]) {
		for (let col of cols) {
			let obj = col.other.obj;
			if (obj instanceof Target && !obj.hasNode) {
				this.scene.assets.sound("target").stop();
				this.scene.assets.sound("target").play();

				obj.addNode();
				if (this.wire) {
					this.wire.setEnd(obj);
					this.wire.remove();
				}

				const wire = this.scene.add(Wire, this.scene);
				wire.setStart(obj);
				wire.setEnd(this);
				this.wire = wire;

				this.imgObject.addTween({
					targets: this.imgObject.transform,
					props: { angle: { from: 0, to: 3 * Math.PI / 2 } },
					duration: 0.5,
					ease: Easing.QuadOut,
				});
			}
			if (obj instanceof Bullet) {
				obj.destroy();
				this.bulletHit();
			}
			if (obj instanceof BombPickup) {
				this.scene.assets.sound("collect-bomb").stop();
				this.scene.assets.sound("collect-bomb").play();
				obj.remove();
				this.getComponent(BombComponent).collectBomb();
				if (!this.scene.game.seenBombTutorial) {
					this.scene.showTutorialText("bomb");
				}
			}
		}
	}

	bulletHit(): void {
		this.dead("bullet");
	}

	explode(): void {
		this.dead("bomb");
	}

	dead(cause: string): void {
		let ourMarker = this.scene.add(DeathMarker, this.scene);
		ourMarker.transform.setPosition(this.transform.x, this.transform.y);
		this.scene.onDeath(cause);
	}

	offSide(): void {
		let ourMarker = this.scene.add(DeathMarker, this.scene);
		let mirrorMarker = this.scene.add(DeathMarker, this.scene);
		ourMarker.transform.setPosition(this.transform.x, this.transform.y);
		let mirror = this.scene.mirrorPlayer;
		mirrorMarker.transform.setPosition(mirror.transform.x, mirror.transform.y);
		this.scene.onDeath("side");
	}

	spawnBomb(): void {
		this.getComponent(BombComponent).spawnBomb();
	}

}