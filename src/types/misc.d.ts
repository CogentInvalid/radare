declare var lume: typeof Lume;
declare var jsonParser: typeof JSONParser;
declare let inspect: ((arg: any, options?: Table) => string) & {METATABLE: string};
declare let bump: typeof Bump;

declare interface Point {x: number, y: number}
declare interface Vector2 {x: number, y: number}
declare interface Rect {x: number, y: number, width: number, height: number}