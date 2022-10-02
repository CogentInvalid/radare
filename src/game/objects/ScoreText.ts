import { TextRenderer } from "core/components/TextRenderer";
import { GameObject } from "core/objects/GameObject";
import { SideListener } from "game/components/SideListener";
import { GameScene } from "game/scenes/GameScene";

export class ScoreText extends GameObject {

	textWhite: TextRenderer;
	scoreWhite = 1;
	textBlack: TextRenderer;
	scoreBlack = 0;

	constructor(scene: GameScene) {
		super(scene);

		let textWhite = this.textWhite = this.addComponent(TextRenderer, "Score: 1", 1000, scene.font);
		textWhite.setColor(1, 1, 1);
		textWhite.setWhiteStencil();

		let textBlack = this.textBlack = this.addComponent(TextRenderer, "Score: 0", 1000, scene.font);
		textBlack.setColor(0, 0, 0);
		textBlack.setBlackStencil();

		this.transform.setPosition(love.graphics.getWidth() / 2, 50);

		let midpointListener = this.addComponent(SideListener, 200);
		midpointListener.offset = -Math.PI / 2;
		midpointListener.onChanged.add((side) => {
			if (side == 0) this.onBlackMidpoint();
			else this.onWhiteMidpoint();
		});
	}

	onBlackMidpoint() {
		this.scoreBlack += 2;
		this.textBlack.str = "Score: " + this.scoreBlack;
	}

	onWhiteMidpoint() {
		this.scoreWhite += 2;
		this.textWhite.str = "Score: " + this.scoreWhite;
	}

}