import { State } from "./State";
import { GameObject } from "./objects/GameObject";
import { Renderer } from "./render/Renderer";
import { DefaultRenderer } from "./render/DefaultRenderer";
import { Image } from "./objects/Image";
import { Game } from "./Game";
import { System } from "./systems/System";
import { Scancode } from "love.keyboard";
import { TimerSystem } from "./systems/TimerSystem";

export class Scene extends State {

	objects: GameObject[] = [];
	systems: System[] = [];
	renderer: Renderer;
	paused = false;
	timers: TimerSystem;

	constructor(game: Game) {
		super(game);
		if (this.renderer == null) this.renderer = new DefaultRenderer(this);
		this.timers = new TimerSystem(this);
	}

	update(dt: number) {
		if (!this.paused) {
			for (let system of this.systems) system.update(dt);
			this.timers.update(dt);
			for (let i = this.objects.length - 1; i >= 0; i--) {
				this.objects[i].update(dt);
			}
			for (let system of this.systems) system.postUpdate(dt);
			for (let i = this.objects.length - 1; i >= 0; i--) {
				this.objects[i].finishPendingDestroy();
			}
			if (this.renderer.update) this.renderer.update(dt);
		}
	}

	draw() {
		this.renderer.draw();
	}

	add<T extends new (...args: any) => (InstanceType<T> & GameObject)>(Type: T, ...params: ConstructorParameters<T>): InstanceType<T> {
		return this.addExisting(new Type(...params));
	}

	addExisting<T extends GameObject>(obj: T): T {
		obj.scene = this;
		this.objects.push(obj);
		obj.onDestroy.add(this.onDestroyObject, this);
		return obj;
	}

	addObject(): GameObject {
		return this.add(GameObject, this);
	}

	private onDestroyObject(obj: GameObject) {
		lume.remove(this.objects, obj);
	}

	findObjectOfType<T extends new (...args: any) => (InstanceType<T> & GameObject)>(Type: T): InstanceType<T> {
		return this.objects.find(c => c instanceof Type) as InstanceType<T>;
	}

	findObjectsOfType<T extends new (...args: any) => (InstanceType<T> & GameObject)>(Type: T): InstanceType<T>[] {
		return this.objects.filter(c => c instanceof Type) as InstanceType<T>[];
	}

	addImage(key: string): Image {
		return this.add(Image, this, key);
	}

	addSystem<T extends System>(sys: T) {
		this.systems.push(sys);
		return sys;
	}

	getSystem<T extends new (...args: any) => (InstanceType<T> & System)>(Type: T): InstanceType<T> {
		return this.systems.find(c => c instanceof Type) as InstanceType<T>;
	}

	keypressed(scancode: Scancode): void {
		for (let system of this.systems) system.keypressed(scancode);
		super.keypressed(scancode);
	}

	keyreleased(scancode: Scancode): void {
		for (let system of this.systems) system.keyreleased(scancode);
		super.keyreleased(scancode);
	}

	mousepressed(x: number, y: number, button: number): void {
		for (let system of this.systems) system.mousepressed(x, y, button);
		super.mousepressed(x, y, button);
	}

	mousereleased(x: number, y: number, button: number): void {
		for (let system of this.systems) system.mousereleased(x, y, button);
		super.mousereleased(x, y, button);
	}

}