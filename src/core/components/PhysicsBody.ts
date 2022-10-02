import { Event } from "core/Event";
import { CollisionManager } from "core/systems/CollisionManager";
import { Component } from "./Component";

export class PhysicsBody extends Component {

	collisions: CollisionManager;
	onCollide: Event<CollisionTable<PhysicsBody>[]> = new Event();

	width: number;
	height: number;
	ox = 0;
	oy = 0;
	vx = 0;
	vy = 0;
	gravity = 0;
	static = false;
	solid = true;
	addedToWorld = false;
	type: number;

	create(type: number, width: number, height: number, ox?: number, oy?: number, isStatic?: boolean, isSolid?: boolean) {
		this.width = width;
		this.height = height;
		this.type = type;
		if (ox) this.ox = ox;
		if (oy) this.oy = oy;
		if (isStatic != null) this.static = isStatic;
		if (isSolid != null) this.solid = isSolid;
		this.collisions = this.scene.getSystem(CollisionManager);
		if (!this.collisions) error("No CollisionManager system in scene");
	}

	destroy() {
		super.destroy();
		this.collisions.remove(this);
	}

	update(dt: number) {
		if (!this.addedToWorld) {
			this.collisions.add(this);
			this.addedToWorld = true;
		}
		this.vy += this.gravity * dt;
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}

	get x() {
		// todo: use global transform
		return this.obj.transform.x + this.ox;
	}

	get y() {
		// todo: use global transform
		return this.obj.transform.y + this.oy;
	}

	private set x(val: number) {
		this.obj.transform.x = val - this.ox;
	}

	private set y(val: number) {
		this.obj.transform.y = val - this.oy;
	}

	moveTo(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	setPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
		this.collisions.updateObject(this);
	}

	setVelocity(vx: number, vy: number): void {
		this.vx = vx;
		this.vy = vy;
	}

	collide(cols: CollisionTable<PhysicsBody>[]) {
		this.onCollide.emit(cols);
	}

}