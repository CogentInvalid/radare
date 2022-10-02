import { Component } from "core/components/Component";
import { Easing } from "core/Easing";
import { Image } from "core/objects/Image";
import { Bomb } from "game/objects/Bomb";
import { Player } from "game/objects/Player";
import { GameScene } from "game/scenes/GameScene";

export class BombComponent extends Component {
	scene: GameScene;
	obj: Player;
	numBombs = 0;
	dots: Image[] = [];

	create(): void {
		for (let i = 0; i < 3; i++) {
			let dot = this.scene.addImage("dot");
			this.dots.push(dot);
			dot.setColor(0, 0, 0);
			dot.setOrigin(0.5);
			dot.image.setBlackStencil();
			this.obj.addChild(dot);
			dot.transform.setPosition([0, -20, 20][i], -38);
			dot.image.alpha = 0;
		}
	}

	collectBomb(): void {
		if (this.numBombs < 3) {
			this.numBombs++;
			this.updateDots();
		}
	}

	spawnBomb() {
		if (this.numBombs == 0) return;
		this.scene.assets.sound("place-bomb").stop();
		this.scene.assets.sound("place-bomb").play();
		let bomb = this.scene.add(Bomb, this.scene);
		bomb.transform.setPosition(this.obj.transform.x, this.obj.transform.y);
		this.numBombs--;
		this.updateDots();
		this.scene.game.seenBombTutorial = true;
	}

	updateDots() {
		for (let i = 0; i < 3; i++) {
			let dot = this.dots[i];
			let prevAlpha = dot.image.alpha;
			dot.image.alpha = (i < this.numBombs) ? 1 : 0;
			if (prevAlpha == 0 && dot.image.alpha == 1) {
				dot.transform.scale = 0;
				dot.addTween({
					targets: dot.transform,
					props: { scale: 1 },
					duration: 0.15,
					ease: Easing.QuadOut,
				});
			}
		}
		for (let i = 0; i < this.numBombs; i++) {
			let dot = this.dots[i];
			let targetX = 20 * (i - ((this.numBombs - 1) / 2));
			if (dot.transform.scale == 0) dot.transform.x = targetX;
			else dot.addTween({
				targets: dot.transform,
				props: { x: targetX },
				duration: 0.15,
				ease: Easing.QuadInOut,
			});
		}
	}

}