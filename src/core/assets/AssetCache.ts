import { ImageLoaderArgs, ImageLoader } from "../assets/ImageLoader";
import { Source } from "love.audio";
import { Image } from "love.graphics";
import { Audio } from "game/Audio";

export class AssetCache {

	images: ImageLoader;
	audio: Audio;

	constructor() {
		this.images = new ImageLoader();
		this.audio = new Audio();
	}

	img(name: string, args?: ImageLoaderArgs): Image {
		return this.images.getImage(name, args);
	}

	sound(name: string): Source | null {
		return this.audio.getSource(name);
	}

	loadText(path: string): string {
		let file = love.filesystem.newFile(path);
		file.open("r");
		let [str, bytes] = file.read(file.getSize());
		file.close();
		return str;
	}

	loadJson(path: string): any {
		let str = this.loadText(path);
		return jsonParser.decode(str);
	}

	clear() {
		this.images.clear();
	}
	
}