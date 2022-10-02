import { Component } from "core/components/Component";
import { PhysicsBody } from "core/components/PhysicsBody";
import { CollisionManager } from "core/systems/CollisionManager";
import { PhysType } from "game/CollisionMap";
import { DeathMarker } from "game/objects/DeathMarker";
import { GameScene } from "game/scenes/GameScene";
import { ImageRenderer } from "../../core/components/ImageRenderer";
import { GameObject } from "../../core/objects/GameObject";
import { Enemy } from "./Enemy";
import { Player } from "./Player";

export class MirrorPlayer extends GameObject {

	scene: GameScene;
	player: Player;

	constructor(scene: GameScene, player: Player) {
		super(scene);
		this.player = player;

		const image = this.addComponent(ImageRenderer, "player");
		image.setOrigin(0.5);
		image.setWhiteStencil();

		const dead = this.addComponent(ImageRenderer, "dead");
		dead.setOrigin(0.5);
		dead.setColor(0, 0, 0);
		dead.setBlackStencil();

		let size = 50;
		if (this.scene.getSystem(CollisionManager)) {
			let phys = this.addComponent(PhysicsBody, PhysType.PLAYER, size, size, -size / 2, -size / 2, false, false);
			phys.onCollide.add(this.onCollide, this);
		}

		this.addComponent(class extends Component {
			obj: MirrorPlayer;
			update(dt: number) {
				let t = this.obj.player.transform;
				let [cx, cy] = scene.getCenter();
				let dx = t.x - cx;
				let dy = t.y - cy;
				this.obj.transform.setPosition(cx - dx, cy - dy);
			}
		});
	}

	onCollide(cols: CollisionTable<PhysicsBody>[]) {
		for (let col of cols) {
			let obj = col.other.obj;
			if (obj instanceof Enemy) this.enemyHit();
		}
	}

	enemyHit(): void {
		this.dead("enemy");
	}

	explode(): void {
		this.dead("bomb");
	}

	dead(cause: string) {
		let ourMarker = this.scene.add(DeathMarker, this.scene);
		ourMarker.transform.setPosition(this.transform.x, this.transform.y);
		this.scene.onDeath(cause);
	}

}