import { Timer } from "core/Timer";
import { System } from "./System";

export class TimerSystem extends System {

	timers: Timer[] = [];

	create(duration: number, callback: (this: any) => any, context?: any) {
		const timer = new Timer(duration, callback, context);
		this.timers.push(timer);
	}

	update(dt: number) {
		for (let i = this.timers.length - 1; i >= 0; i--) {
			let timer = this.timers[i];
			timer.update(dt);
			if (timer.complete) lume.remove(this.timers, timer);
		}
	}

	removeAll(): void {
		this.timers = [];
	}

}