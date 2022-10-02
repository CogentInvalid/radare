import { GameLayer, GameObject } from "core/objects/GameObject";
import { CameraManager } from "core/systems/CameraManager";
import { Renderer } from "./Renderer";

export class DefaultRenderer extends Renderer {

    camera?: CameraManager;

    draw() {
        this.camera?.attach();

        let bounds = this.camera?.getWorldBounds() ?? {x: 0, y: 0, width: love.graphics.getWidth(), height: love.graphics.getHeight()};

        let objects = this.getDrawOrder(this.scene.objects);
        for (let obj of objects) {
            obj.draw(bounds);
        }
        this.camera?.detach();
        love.graphics.origin();
    }

    getDrawOrder(objects: GameObject[]): GameObject[] {
        let layers: GameLayer[] = ["default", "ui"];
        let l2 = [];
        for (let layer of layers) {
            for (let obj of objects) {
                if (obj.layer == layer) l2.push(obj);
            }
        }
        return l2;
        // error(inspect(l2.sort((a, b) => layers.indexOf(a.layer) - layers.indexOf(b.layer)), {depth: 2}));
        // return l2.sort((a, b) => layers.indexOf(a.layer) - layers.indexOf(b.layer));

        // return lume.sort(objects, function (a, b) { return 2 > 3 });
        // objects.sort((a, b) => layers.indexOf(a.layer) - layers.indexOf(b.layer));
        // return objects;
    }

}