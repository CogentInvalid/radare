import { Source } from "love.audio";
import { SoundData } from "love.sound";

interface Path {
	prefix: string, suffix: string
}

export type ImageLoaderArgs = {
	path?: Path;
}

export class Audio {

	defaultPath: Path = {
		prefix: "assets/audio/",
		suffix: ".ogg",
	};

	defaultArgs: ImageLoaderArgs = {
		path: this.defaultPath,
	};

	sources: { [key: string]: Source } = {};
	soundData: { [key: string]: SoundData } = {};

	constructor() {
		this.loadAudio("target");
		this.loadAudio("shoot");
		this.loadAudio("collect-bomb");
		this.loadAudio("place-bomb");
		this.loadAudio("tick1");
		this.loadAudio("tick2");
		this.loadAudio("explosion");
		this.loadAudio("dead");

		let bgmIntro = love.sound.newSoundData("assets/audio/processing-intro.ogg");
		let bgmLoop = love.sound.newSoundData("assets/audio/processing-loop.ogg");
		this.soundData["bgmIntro"] = bgmIntro;
		this.soundData["bgmLoop"] = bgmLoop;
	}

	loadAudio(name: string, args?: ImageLoaderArgs) {
		if (args == undefined) args = this.defaultArgs;
		let path = args.path ? args.path : this.defaultPath;

		if (!this.sources[name]) this.load(name, path);

		return this.sources[name];
	}

	private load(name: string, path: Path) {
		this.sources[name] = love.audio.newSource(path.prefix + name + path.suffix, "static");
	}

	getSource(name) {
		return this.sources[name];
	}

}