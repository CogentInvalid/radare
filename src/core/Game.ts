import { GameScene } from "game/scenes/GameScene";
import { MenuScene } from "game/scenes/MenuScene";
import { Scancode } from "love.keyboard";
import { AssetCache } from "./assets/AssetCache";
import { Console } from "./Console";
import { State } from "./State";

export class Game {

	state: State;
	assets: AssetCache;
	// console: Console;

	gameScene = GameScene;
	menuScene = MenuScene;

	lastScore: number;
	highScore = 0;
	seenMovementTutorial = false;
	seenBombTutorial = false;

	constructor(args: any) {
		// this.console = new Console(this, args);
		math.randomseed(os.time())
		love.math.setRandomSeed(os.time())

		this.assets = new AssetCache();
		let config = this.assets.loadJson("assets/game-config.json");
		let sceneModule = config.startScene as string;
		let sceneName = sceneModule.split(".").pop();
		let scene = require(sceneModule)[sceneName];
		this.setState(scene);
	}

	setState<T extends new (...args: any) => (InstanceType<T> & State)>(Type: T) {
		this.state = new Type(this);
	}

	update(dt: number) {
		// TODO fixed timestep
		if (dt > 0.1) dt = 0.1;
		if (this.state) this.state.update(dt);
		// this.console.update(dt);
	}

	draw() {
		if (this.state) this.state.draw();
		// this.console.draw();
	}

	keypressed(scancode: Scancode, isrepeat: boolean) {
		// if (this.console.inputFocused()) return;
		if (scancode == "escape") love.event.quit();
		// else if (scancode == "tab") this.console.toggle();
		// else if (scancode == "1") this.setState(MenuScene);
		// else if (scancode == "2") this.setState(GameScene);
		// else if (scancode == "f11") this.toggleFullscreen();
		else if (this.state) this.state.keypressed(scancode, isrepeat);
	}

	keyreleased(scancode: Scancode) {
		if (this.state) this.state.keyreleased(scancode);
	}

	mousepressed(x: number, y: number, button: number) {
		if (this.state) this.state.mousepressed(x, y, button);
	}

	mousereleased(x: number, y: number, button: number) {
		if (this.state) this.state.mousereleased(x, y, button);
	}

	resize(w: number, h: number) {
		if (this.state) this.state.resize(w, h);
	}

	toggleFullscreen() {
		let [fullscreen] = love.window.getFullscreen();
		love.window.setFullscreen(!fullscreen);
	}

}