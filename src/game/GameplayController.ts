import { System } from "core/systems/System";
import { Enemy } from "./objects/Enemy";
import { Target } from "./objects/Target";
import { Tile } from "./objects/Tile";
import { GameScene } from "./scenes/GameScene";

export class GameplayController extends System {

	scene: GameScene;

	targetSpawnTimeMin = 3;
	targetSpawnTimeMax = 5;

	enemySpawnTimeMin = 10;
	enemySpawnTimeMax = 20;

	bombSpawnTimeMin = 9;
	bombSpawnTimeMax = 17;

	gameplayTimer = 0;

	targetCandidatesEnabled = false;
	targetCandidates: Tile[] = [];

	constructor(scene: GameScene) {
		super(scene);

		this.scene.onBlackMidpoint.add(this.onBlackMidpoint, this);

		this.scene.timers.create(1, this.onTargetSpawnRequested, this);
		this.scene.timers.create(10, this.spawnEnemy, this);
		this.scene.timers.create(10 + 6, this.spawnBomb, this);
	}

	update(dt: number): void {
		this.gameplayTimer += dt;
	}

	getEnemySpawnTime() {
		let progress = lume.clamp(this.gameplayTimer / (4 * 60), 0, 1);
		let baseTime = lume.lerp(10, 2, progress);
		let forgivenessScale = 0.5;
		let numEnemies = this.scene.findObjectsOfType(Enemy).length;
		return baseTime + (baseTime * numEnemies * forgivenessScale);
	}

	onTargetSpawnRequested(): void {
		this.scene.timers.create(lume.random(this.targetSpawnTimeMin, this.targetSpawnTimeMax), this.onTargetSpawnRequested, this);

		this.targetCandidatesEnabled = true;
		this.scene.timers.create(0.75, this.onTargetSpawnNeeded, this);
	}

	onTargetSpawnNeeded(): void {
		if (this.targetCandidates.length > 0) {
			this.targetCandidatesEnabled = false;
			const tile = lume.randomchoice(this.targetCandidates);
			tile.spawnTarget();
		}
		else {
			this.scene.timers.create(0.75, this.onTargetSpawnNeeded, this);
		}
		this.targetCandidates = [];
	}

	onBlackMidpoint(tile: Tile): void {
		if (this.targetCandidatesEnabled) {
			this.targetCandidates.push(tile);
		}
	}

	spawnEnemy(): void {
		const validTiles = this.scene.findObjectsOfType(Tile).filter(t => {
			let inWhite = !t.sideListener.touchingBlack;
			let empty = t.object == null;
			let opposite = t.getOppositeTile();
			let noOppositeTarget = !(opposite.object && opposite.object instanceof Target);
			return inWhite && empty && noOppositeTarget;
		});
		if (validTiles.length > 0) {
			lume.randomchoice(validTiles).spawnEnemy();
		}
		this.scene.timers.create(this.getEnemySpawnTime(), this.spawnEnemy, this);
	}

	spawnBomb(): void {
		const validTiles = this.scene.findObjectsOfType(Tile).filter(t => {
			let inBlack = !t.sideListener.touchingWhite;
			let empty = t.object == null;
			return inBlack && empty;
		});
		if (validTiles.length > 0) {
			lume.randomchoice(validTiles).spawnBomb();
		}
		this.scene.timers.create(lume.random(this.bombSpawnTimeMin, this.bombSpawnTimeMax), this.spawnBomb, this);
	}

	onDeath(): void {
		this.scene.timers.removeAll();
	}

}