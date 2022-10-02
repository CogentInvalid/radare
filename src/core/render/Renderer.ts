import { GameObject } from "core/objects/GameObject";
import { Scene } from "core/Scene";

export abstract class Renderer {

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    update?(dt: number): void;
    abstract draw(): void;

    getDrawOrder(objects: GameObject[]): GameObject[] {
        return objects;
    }

}