import { Event } from "core/Event";
import { Scene } from "core/Scene";
import { Scancode } from "love.keyboard";
import { System } from "./System";

export type InputState = { [action: string]: { pressed: boolean, down: boolean; released: boolean; onPressed: Event<void> } };
  
export class InputSystem extends System {

	binds: { [key in Scancode]?: string } = {};
	actions: InputState = {};

	constructor(scene: Scene, configPath?: string) {
		super(scene);

		if (configPath) {
			let config = this.scene.assets.loadJson(configPath);
			for (const bind of config) this.setBind(bind.key, bind.action);
		}
	}

	update(dt) {
		for (let key in this.binds) {
			let down = love.keyboard.isScancodeDown(key as Scancode);
			const action = this.actions[this.binds[key]];
			if (action == null) error(`no action ${this.binds[key]}`);
			action.down = down;
		}
	}

	postUpdate() {
		for (let key in this.binds) {
			const action = this.actions[this.binds[key]];
			action.pressed = false;
			action.released = false;
		}
	}

	keypressed(key: Scancode) {
		const action = this.actions[this.binds[key]];
		if (action) {
			action.pressed = true;
			action.onPressed.emit();
		}
	}

	keyreleased(key: Scancode) {
		const action = this.actions[this.binds[key]];
		if (action) action.released = true;
	}

	setBind(key: Scancode, action: string) {
		this.binds[key] = action;
		if (!this.actions[action]) this.actions[action] = this.createAction();
	}

	private createAction() {
		return {
			pressed: false,
			down: false,
			released: false,
			onPressed: new Event<void>(),
		};
	}

	down(action: string) {
		return this.actions[action].down;
	}

	pressed(action: string) {
		return this.actions[action].pressed;
	}

	released(action: string) {
		return this.actions[action].released;
	}

}