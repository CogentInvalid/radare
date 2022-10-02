export enum PhysType {
	NONE = 0b00000000,
	WALL = 0b00000001,
	PLAYER = 0b00000010,
	ENEMY = 0b00000100,
	BULLET = 0b00001000,
}

export let collisionMap = {
	[PhysType.NONE]: 0,
	[PhysType.WALL]: PhysType.NONE,
	[PhysType.PLAYER]: PhysType.WALL + PhysType.BULLET + PhysType.ENEMY,
	[PhysType.ENEMY]: PhysType.BULLET + PhysType.WALL,
	[PhysType.BULLET]: 0,
}