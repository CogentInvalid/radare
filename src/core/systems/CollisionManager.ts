import { ImageRenderer } from "core/components/ImageRenderer";
import { PhysicsBody } from "core/components/PhysicsBody";
import { UpdateComponent } from "core/components/UpdateComponent";
import { Scene } from "core/Scene";
import { System } from "./System";

export class CollisionManager extends System {

	world: BumpWorld;
	objects: PhysicsBody[] = [];
	collisionMap: {[key: number]: number};

	constructor(scene: Scene, collisionMap: {[key: number]: number}) {
		super(scene);
		this.world = bump.newWorld();
		this.collisionMap = collisionMap;
	}

	add(obj: PhysicsBody) {
		this.objects.push(obj);
		this.world.add(obj, obj.x, obj.y, obj.width, obj.height);
	}

	has(obj: PhysicsBody): boolean {
		return this.world.hasItem(obj);
	}

	postUpdate(dt: number) {
		for (let obj of this.objects) {
			if (!obj.static) {
				let [newX, newY, collisions, numCollisions] = this.world.move(obj, obj.x, obj.y, (...a) => this.defaultFilter(...a));
				obj.setPosition(newX, newY);
				// collisions.forEach(c => this.debugCollision(c));
				if (numCollisions > 0) obj.collide(collisions);
			}
		}
	}

	updateObject(obj: PhysicsBody, x?: number, y?: number): void {
		this.world.update(obj, x ?? obj.x, y ?? obj.y);
	}

	remove(obj: PhysicsBody) {
		lume.remove(this.objects, obj);
		this.world.remove(obj);
	}

	debugCollision(col: CollisionTable<any>): void {
		let debug = this.scene.addObject();
		debug.transform.setScale(0.2);
		debug.transform.setPosition(col.touch.x, col.touch.y);
		let img = debug.addComponent(ImageRenderer, "player");
		img.setColor(1, 0, 0);
		img.setOrigin(0.5);
		let timer = 1;
		debug.addComponent(UpdateComponent, (dt) => {
			timer -= dt;
			img.alpha = timer;
			if (timer <= 0) debug.destroy();
		});
	}

	defaultFilter(item: PhysicsBody, other: PhysicsBody): CollisionType {
		if ((other.type & this.collisionMap[item.type]) != 0) return (other.solid) ? "slide" : "cross";
	}

}