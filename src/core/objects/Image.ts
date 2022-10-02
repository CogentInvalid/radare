import { ImageRenderer } from "core/components/ImageRenderer";
import { GameObject } from "core/objects/GameObject";
import { Scene } from "core/Scene";

export class Image extends GameObject {
	image: ImageRenderer;

	constructor(scene: Scene, key: string) {
		super(scene);
		this.image = this.addComponent(ImageRenderer, key);
	}

	setOrigin(x: number, y?: number) {
		this.image.setOrigin(x, y);
	}

	setColor(r: number, g: number, b: number, a?: number) {
		this.image.setColor(r, g, b, a);
	}
}