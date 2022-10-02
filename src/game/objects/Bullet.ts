import { ImageRenderer } from "core/components/ImageRenderer";
import { Lifespan } from "core/components/Lifespan";
import { PhysicsBody } from "core/components/PhysicsBody";
import { UpdateComponent } from "core/components/UpdateComponent";
import { GameObject } from "core/objects/GameObject";
import { Scene } from "core/Scene";
import { PhysType } from "game/CollisionMap";

export class Bullet extends GameObject {

	phys: PhysicsBody;

	constructor(scene: Scene) {
		super(scene);

		let blackImg = this.addComponent(ImageRenderer, "bullet-black");
		blackImg.setOrigin(0.5, 0.5);
		blackImg.setBlackStencil();

		let whiteImg = this.addComponent(ImageRenderer, "bullet-white");
		whiteImg.setColor(1, 1, 1, 0.25);
		whiteImg.setOrigin(0.5, 0.5);
		whiteImg.setWhiteStencil();

		this.phys = this.addComponent(PhysicsBody, PhysType.BULLET, 4, 4, -2, -2, false, false);
		this.phys.onCollide.add(this.onCollide, this);

		this.addComponent(UpdateComponent, () => {
			this.transform.angle = math.atan2(this.phys.vy, this.phys.vx);
		});

		this.addComponent(Lifespan, 5);
	}

	onCollide(cols: CollisionTable<PhysicsBody>[]): void {
		for (let col of cols) {
			if (col.type != "cross") {
				// if (col.normal.x != 0) this.phys.vx *= -1;
				// if (col.normal.y != 0) this.phys.vy *= -1;
			}
		}
	}

}