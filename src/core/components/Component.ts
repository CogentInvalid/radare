import { GameObject } from "../objects/GameObject";
import { Scene } from "../Scene";

export class Component {

	obj: GameObject;
	scene: Scene;

	constructor(object: GameObject) {
		this.obj = object;
		this.scene = object.scene;
	}

	create(...args: any[]) {}
	update?(dt: number): any;
	draw?(bounds?: Rect): any;
	destroy() {
		this.obj.removeComponent(this);
	};

}