import { ImageRenderer } from "core/components/ImageRenderer";
import { TextRenderer } from "core/components/TextRenderer";
import { Easing } from "core/Easing";
import { Event } from "core/Event";
import { Game } from "core/Game";
import { DefaultRenderer } from "core/render/DefaultRenderer";
import { CameraManager } from "core/systems/CameraManager";
import { CollisionManager } from "core/systems/CollisionManager";
import { InputSystem } from "core/systems/InputSystem";
import { collisionMap } from "game/CollisionMap";
import { FPSLogger } from "game/FPSLogger";
import { GameplayController } from "game/GameplayController";
import { MirrorPlayer } from "game/objects/MirrorPlayer";
import { ScoreText } from "game/objects/ScoreText";
import { Spinner } from "game/objects/Spinner";
import { Tile } from "game/objects/Tile";
import { Wall } from "game/objects/Wall";
import { Source } from "love.audio";
import { Font } from "love.graphics";
import { Scancode } from "love.keyboard";
import { Scene } from "../../core/Scene";
import { Player } from "../objects/Player";

export class GameScene extends Scene {

	renderer: DefaultRenderer;

	gameConfig: any;
	spinner: Spinner;

	tiles: Tile[][];
	player: Player;
	mirrorPlayer: MirrorPlayer;

	onBlackMidpoint: Event<Tile> = new Event();

	gameOver = false;

	font: Font;

	bgm: Source;

	constructor(game: Game) {
		super(game);

		this.font = love.graphics.newFont("assets/font/couriercode-bold.ttf", 20);

		this.addSystem(new CollisionManager(this, collisionMap));
		let input = this.addSystem(new InputSystem(this));
		let config = this.gameConfig = this.assets.loadJson("assets/game-config.json");
		for (let bind of config.inputBinds) input.setBind(bind.key, bind.action);
		this.addSystem(new GameplayController(this));

		let bg = this.addImage("whiteSquare");
		bg.setColor(0.5, 0.5, 0.5);
		bg.transform.setScale(100, 100);

		let spinner = this.spinner = this.add(Spinner, this);
		spinner.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 2);

		this.add(Wall, this, -50, -50, 50, 1000);
		this.add(Wall, this, -50, -50, 1000, 50);
		this.add(Wall, this, 800, 0, 50, 1000);
		this.add(Wall, this, 0, 800, 1000, 50);

		const tileSize = 50;

		this.tiles = [];
		for (let x = 0; x < 800 / tileSize; x++) {
			this.tiles[x] = [];
			for (let y = 0; y < 800 / tileSize; y++) {
				const tile = this.add(Tile, this, x, y);
				this.tiles[x][y] = tile;
				tile.transform.setPosition(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
			}
		}

		let player = this.player = this.add(Player, this);
		player.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 4 - 25);
		let mirrorPlayer = this.mirrorPlayer = this.add(MirrorPlayer, this, player);
		mirrorPlayer.transform.setPosition(200 - 25, 200 - 25);

		this.add(ScoreText, this);

		let target = this.tiles[12][3].spawnTarget();
		target?.addDeadImage();

		if (!game.seenMovementTutorial) {
			this.timers.create(1, () => this.showTutorialText("wasd"));
			game.seenMovementTutorial = true;
		}

		let cam = this.addSystem(new CameraManager(this));
		this.renderer.camera = cam;
		cam.setTarget({ x: love.graphics.getWidth() / 2, y: love.graphics.getHeight() / 2 }, true);

		// this.addSystem(new FPSLogger(this, this.game.console));

		let bgmIntro = this.assets.audio.soundData["bgmIntro"];
		let bgmLoop = this.assets.audio.soundData["bgmLoop"];
		let sampleRate = bgmIntro.getSampleRate();
		let bitDepth = bgmIntro.getBitDepth() as (8 | 16);
		let bgm = this.bgm = love.audio.newQueueableSource(sampleRate, bitDepth, 2, 4);
		bgm.setVolume(0.9);
		bgm.queue(bgmIntro);
		bgm.queue(bgmLoop);
		bgm.play();
	}

	update(dt: number): void {
		super.update(dt);
		if (this.bgm.getFreeBufferCount() > 0) this.bgm.queue(this.assets.audio.soundData["bgmLoop"]);
	}

	onDeath(cause: string): void {
		if (this.gameOver) return;
		this.gameOver = true;
		this.bgm.stop();
		this.assets.sound("dead").stop();
		this.assets.sound("dead").play();
		this.player.destroy();
		this.mirrorPlayer.destroy();
		this.getSystem(GameplayController).onDeath();
		let scoreText = this.findObjectOfType(ScoreText);
		let score = math.max(scoreText.scoreBlack, scoreText.scoreWhite);
		this.game.lastScore = score;
		if (score > this.game.highScore) this.game.highScore = score;
		this.showDeathText(cause);
	}

	showDeathText(cause: string) {
		let popup = this.showTextBox("textbox", this.gameConfig.deathText[cause]);
		popup.layer = "ui";

		let renderers = [...popup.getComponents(ImageRenderer), ...popup.getComponents(TextRenderer)];
		renderers.forEach(r => r.alpha = 0);
		popup.addTween({
			targets: renderers,
			props: { alpha: 1 },
			duration: 2,
			delay: 1,
		});
		popup.addTimer(7, () => this.game.setState(this.game.menuScene));
	}

	showTutorialText(text: string): void {
		let popup = this.showTextBox("tutorialbox", this.gameConfig.tutorialText[text]);
		popup.layer = "ui";

		popup.transform.scale = 1.1;
		popup.addTween({
			targets: popup.transform,
			props: { scale: 1 },
			duration: 0.3,
			ease: Easing.QuadOut,
		});

		let renderers = [...popup.getComponents(ImageRenderer), ...popup.getComponents(TextRenderer)];
		renderers.forEach(r => r.alpha = 0);
		popup.addTween({
			targets: renderers,
			props: { alpha: 1 },
			duration: 0.3,
		});

		popup.addTimer(5, () => {
			popup.addTween({
				targets: renderers,
				props: { alpha: 0 },
				duration: 0.4,
				onComplete: () => popup.destroy(),
			});
		});
	}

	showTextBox(img: string, str: string) {
		let popup = this.addObject();

		let textboxWhite = popup.addComponent(ImageRenderer, img + "-white");
		textboxWhite.setOrigin(0.5);
		textboxWhite.setWhiteStencil();
		let textWhite = popup.addComponent(TextRenderer, str, 1000, this.font);
		textWhite.setColor(1, 1, 1);
		textWhite.setWhiteStencil();

		let textboxBlack = popup.addComponent(ImageRenderer, img + "-black");
		textboxBlack.setOrigin(0.5);
		textboxBlack.setBlackStencil();
		let textBlack = popup.addComponent(TextRenderer, str, 1000, this.font);
		textBlack.setColor(0, 0, 0);
		textBlack.setBlackStencil();
		popup.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 2);

		return popup;
	}

	getCenter() {
		return [love.graphics.getWidth() / 2, love.graphics.getHeight() / 2];	
	}

	getOppositeTile(x: number, y: number) {
		let x2 = 15 - x;
		let y2 = 15 - y;
		return this.tiles[x2][y2];
	}

	keypressed(scancode: Scancode, isrepeat?: boolean): void {
		if (scancode == "p") {
			this.paused = !this.paused;
		}
		// if (scancode == "k") {
		// 	this.getSystem(CameraManager).setScreenShake(0.2);
		// }
		super.keypressed(scancode);
	}

}