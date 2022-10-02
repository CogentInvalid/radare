import { TextRenderer } from "core/components/TextRenderer";
import { Game } from "core/Game";
import { Scancode } from "love.keyboard";
import { Scene } from "../../core/Scene";

export class MenuScene extends Scene {

	debug: string = "";

	constructor(game: Game) {
		super(game);

		let bigFont = love.graphics.newFont("assets/font/couriercode-bold.ttf", 100);
		let smallFont = love.graphics.newFont("assets/font/couriercode-bold.ttf", 20);

		let white = this.addImage("whiteSquare");
		white.setOrigin(0.5, 1);
		white.transform.scale = 20;
		white.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 2);

		let black = this.addImage("whiteSquare");
		black.setColor(0, 0, 0);
		black.setOrigin(0.5, 0);
		black.transform.scale = 20;
		black.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 2);

		let title = this.addObject();
		let titleText = title.addComponent(TextRenderer, "RADARE", 1000, bigFont);
		titleText.setColor(0, 0, 0);
		title.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 4);

		let desc = this.addObject();
		let descText = desc.addComponent(TextRenderer, "Every ten seconds\nDaytime gives way to the night\nPress Enter to start", 1000, smallFont);
		descText.setColor(1, 1, 1);
		desc.transform.setPosition(love.graphics.getWidth() / 2, 3 * love.graphics.getHeight() / 4);

		if (game.lastScore) {
			let lastScore = this.addObject();
			lastScore.addComponent(TextRenderer, "Score: " + game.lastScore, 500, smallFont).setColor(0, 0, 0);
			lastScore.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 2 - 15);

			let highScore = this.addObject();
			highScore.addComponent(TextRenderer, "High score: " + game.highScore, 500, smallFont).setColor(1, 1, 1);
			highScore.transform.setPosition(love.graphics.getWidth() / 2, love.graphics.getHeight() / 2 + 15);
		}

		// this.addSystem(new FPSLogger(this, this.game.console));
	}

	update(dt: number) {
		super.update(dt);
	}

	keypressed(scancode: Scancode) {
		super.keypressed(scancode);

		if (scancode == "return") {
			this.game.setState(this.game.gameScene);
		}
	}

	draw() {
		super.draw();
	}

}