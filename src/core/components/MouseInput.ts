import { Event } from "core/Event";
import { Component } from "./Component";
import { ImageRenderer } from "./ImageRenderer";

export class MouseInput extends Component {

	target: ImageRenderer;
	mouseOver = false;

	onMouseEnter = new Event<void>();
	onMouseExit = new Event<void>();

	create(target: ImageRenderer) {
		this.target = target;
	}

	mouseInBounds() {
		let [x, y] = love.mouse.getPosition();
		return this.target.pointInBounds(x, y);
	}

	onMouseInBounds() {
		if (!this.mouseOver) {
			this.mouseOver = true;
			this.onMouseEnter.emit();
		}
	}

	onMouseOutOfBounds() {
		if (this.mouseOver) {
			this.mouseOver = false;
			this.onMouseExit.emit();
		}
	}

}