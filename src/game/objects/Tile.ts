import { GameObject } from "core/objects/GameObject";
import { SideListener } from "game/components/SideListener";
import { GameScene } from "game/scenes/GameScene";
import { BombPickup } from "./BombPickup";
import { Enemy } from "./Enemy";
import { Target } from "./Target";

export class Tile extends GameObject {

	scene: GameScene;
	xIndex: number;
	yIndex: number
	object?: GameObject;
	sideListener: SideListener;
	midpointListener: SideListener;

	constructor(scene: GameScene, xIndex: number, yIndex: number) {
		super(scene);

		this.xIndex = xIndex;
		this.yIndex = yIndex;

		// let image = this.addComponent(ImageRenderer, "target");
		// image.setOrigin(0.5, 0.5);
		// image.setColor(0.5, 0.5, 0.5);
		// this.addComponent(class extends Component {
		// 	obj: Tile;
		// 	update(dt: number) {
		// 		image.alpha = (!this.obj.sideListener.touchingBlack) ? 1 : 0;
		// 	}
		// });

		this.sideListener = this.addComponent(SideListener, 80);

		this.midpointListener = this.addComponent(SideListener, 80);
		this.midpointListener.offset = -Math.PI / 2; // listen for midpoint of color instead of color change
		this.midpointListener.onChanged.add((side) => {
			if (side == 0) this.onBlackMidpoint();
			else this.onWhiteMidpoint();
		});

	}

	onBlackMidpoint(): void {
		this.scene.onBlackMidpoint.emit(this);
		// if (this.object == null && math.random() < 0.02) {
		// 	this.spawnTarget();
		// }
	}

	onWhiteMidpoint(): void {

	}

	getOppositeTile() {
		return this.scene.getOppositeTile(this.xIndex, this.yIndex);
	}

	spawnTarget() {
		if (this.object) return;
		const target = this.scene.add(Target, this.scene);
		this.addObject(target);
		const opposite = this.getOppositeTile();
		// delete any enemies directly opposite from the target
		if (opposite.object && opposite.object instanceof Enemy) opposite.object.destroy();
		return target;
	}

	spawnEnemy(): void {
		if (this.object) return;
		const enemy = this.scene.add(Enemy, this.scene);
		this.addObject(enemy);
	}

	spawnBomb(): void {
		if (this.object) return;
		const bomb = this.scene.add(BombPickup, this.scene);
		this.addObject(bomb);
	}

	addObject(obj: GameObject): void {
		obj.transform.setPosition(this.transform.x, this.transform.y);
		this.object = obj;
		obj.onDestroy.once(() => {
			this.object = null;
		});
	}

}