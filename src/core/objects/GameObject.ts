import { Component } from "../components/Component";
import { Transform } from "../Transform";
import { Event } from "../Event";
import { Scene } from "../Scene";
import { TimerComponent } from "core/components/TimerComponent";
import { TweenConfig } from "core/Tween";
import { TweenComponent } from "core/components/TweenComponent";
import { AsyncScriptedSequence } from "core/components/AsyncScriptedSequence";

type ComponentType = new (...args: ConstructorParameters<typeof Component>) => Component;
type ComponentInstance<T extends ComponentType> = Component & InstanceType<T>;

export type GameLayer = "default" | "ui";

export class GameObject {
	scene: Scene;
	parent?: GameObject;
	children: GameObject[] = [];
	components: Component[];
	transform: Transform;

	layer: GameLayer = "default";

	pendingDestroy = false;
	onDestroy = new Event<GameObject>();

	constructor(scene: Scene) {
		this.scene = scene;
		this.components = [];
		this.transform = new Transform();
	}

	destroy() {
		this.pendingDestroy = true;
	}

	finishPendingDestroy() {
		if (this.pendingDestroy) {
			for (let component of [...this.components]) {
				component?.destroy();
			}
			for (let child of this.children) child.destroy();
			this.onDestroy.emit(this);
		}
	}

	update(dt: number) {
		for (let component of [...this.components]) {
			if (component.update) component.update(dt);
		}
	}

	draw(bounds?: Rect) {
		for (let component of this.components) {
			if (component.draw) component.draw(bounds);
		}
	}

	private addComponentExisting<T extends Component>(component: T, ...params: Parameters<T["create"]>): T {
		this.components.push(component);
		component.create(...params);
		return component;
	}

	addComponent<T extends new (...args: ConstructorParameters<typeof Component>) => ComponentInstance<T>>(Type: T, ...params: Parameters<ComponentInstance<T>["create"]>): InstanceType<T> {
		return this.addComponentExisting(new Type(this), ...params);
	}

	getComponent<T extends new (...args: any) => (InstanceType<T> & Component)>(Type: T): InstanceType<T> {
		return this.components.find(c => c instanceof Type) as InstanceType<T>;
	}

	getComponents<T extends new (...args: any) => (InstanceType<T> & Component)>(Type: T): InstanceType<T>[] {
		return this.components.filter(c => c instanceof Type) as InstanceType<T>[];
	}

	removeComponent(component: Component) {
		lume.remove(this.components, component);
	}

	addChild(child: GameObject) {
		this.children.push(child);
		child.parent = this;
		
		this.transform.addChild(child.transform);
		return child;
	}

	addTimer(duration: number, callback: (this: any) => any, context?: any) {
		this.addComponent(TimerComponent, duration, callback, context);
	}

	addTween(config: TweenConfig) {
		this.addComponent(TweenComponent, config);
	}

	addSequence(func: (this: AsyncScriptedSequence) => Promise<any>) {
		let seq = this.addComponent(class extends AsyncScriptedSequence {
			async script(): Promise<any> {
				await func.call(this);
			}
		})
		seq.execute();
	}

}