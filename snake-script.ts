import {
    Application,
    Graphics,
    DisplayObject,
    Rectangle,
    Text
} from "pixi.js";

import { random } from "introcs";

const app = new Application(990, 630, { backgroundColor: 0x32CD32});
document.body.appendChild(app.view);

class Body {
    square: Graphics = new Graphics().drawRect(0, 0, 30, 30).beginFill(0xC0C0C0);
    constructor(x: number, y: number) {
        this.square.x = x;
        this.square.y = y;
        app.stage.addChild(this.square);
    }
}

let head = new Graphics();
head.beginFill(0xFF0000);
head.drawRect(0, 0, 30, 30);
app.stage.addChild(head);

let bodyArray: Body[] = [];

let L = 0;
let R = 0;
let U = 0;
let D = 0;

window.onkeydown = (e: KeyboardEvent): void => {
    console.log("key: " + e.keyCode);
    const LEFT: number = 37;
    const RIGHT: number = 39;
    const UP: number = 38;
    const DOWN: number = 40;
    if (e.keyCode === RIGHT && L === 0) {
        R = 30;
        L = 0;
        U = 0;
        D = 0;
    } else if (e.keyCode === LEFT && R === 0) {
        L = -30;
        R = 0;
        U = 0;
        D = 0;
    } else if (e.keyCode === UP && D === 0) {
        U = -30;
        L = 0;
        R = 0;
        D = 0;
    } else if (e.keyCode === DOWN && U === 0) {
        D = 30;
        U = 0;
        L = 0;
        R = 0;
    }
};

let isColliding = (a: DisplayObject, b: DisplayObject): boolean => {
    let ab: Rectangle = a.getBounds();
    let bb: Rectangle = b.getBounds();
    return ab.x === bb.x && ab.y === bb.y ;
};
let follow = (a: DisplayObject, b: DisplayObject):void => {
    b.x = a.x;
    b.y = a.y;
};

let food = new Graphics();
food.beginFill(0xffffff);
food.drawRect(0, 0, 30, 30);
app.stage.addChild(food);

let loss = (): void => {
    app.stage.removeChild(head);
    app.stage.removeChild(food);
    for (let j = 0; j < bodyArray.length; j++) {
        app.stage.removeChild(bodyArray[j].square);
    }
    let message = new Text("Game Over\n\nBody Length: " + (bodyArray.length));
    message.x = 400;
    message.y = 300;
    app.stage.addChild(message);
    let i = bodyArray.length;
};

let z = 0;
let meals = 0;
let gameLoop = (delta: number): void => {
    z++;
    if (z === 1) {
        food.x = random(0, 32) * 30;
        food.y = random(0, 20) * 30;
        meals++;
    }
    if (z % 10 === 0) {
        for (let i = bodyArray.length - 1; i >= 0; i--) {
            if (i === 0) {
                follow(head, bodyArray[i].square);
            } else {
                follow(bodyArray[i - 1].square, bodyArray[i].square);
            }
        }
        head.x += (L + R);
        head.y += (U + D);
        if (head.y < 0 || head.y > 630 || head.x < 0 || head.x > 990) {
            loss();
        }
        if (isColliding(head, food) && R === 30) {
            food.x = random(0, 32) * 30;
            food.y = random(0, 20) * 30;
            meals++;
            if (meals === 2) {
                bodyArray[bodyArray.length] = new Body(head.x - 30, head.y);
            } else if (meals > 2) {
                bodyArray[bodyArray.length] = new Body(bodyArray[bodyArray.length - 1].square.x - 30, bodyArray[bodyArray.length - 1].square.y);
            }
        } else if (isColliding(head, food) && D === 30) {
            food.x = random(0, 32) * 30;
            food.y = random(0, 20) * 30;
            meals++;
            if (meals === 2) {
                bodyArray[bodyArray.length] = new Body(head.x, head.y - 30);
            } else if (meals > 2) {
                bodyArray[bodyArray.length] = new Body(bodyArray[bodyArray.length - 1].square.x, bodyArray[bodyArray.length - 1].square.y - 30);
            }
        } else if (isColliding(head, food) && L === -30) {
            food.x = random(0, 32) * 30;
            food.y = random(0, 20) * 30;
            meals++;
            if (meals === 2) {
                bodyArray[bodyArray.length] = new Body(head.x + 30, head.y);
            } else if (meals > 2) {
                bodyArray[bodyArray.length] = new Body(bodyArray[bodyArray.length - 1].square.x + 30, bodyArray[bodyArray.length - 1].square.y);
            }
        } else if (isColliding(head, food) && U === -30) {
            food.x = random(0, 32) * 30;
            food.y = random(0, 20) * 30;
            meals++;
            if (meals === 2) {
                bodyArray[bodyArray.length] = new Body(head.x, head.y + 30);
            } else if (meals > 2) {
                bodyArray[bodyArray.length] = new Body(bodyArray[bodyArray.length - 1].square.x, bodyArray[bodyArray.length - 1].square.y + 30);
            }
        }
        for (let i = 0; i < bodyArray.length; i++) {
            if (isColliding(head, bodyArray[i].square)) {
                loss();
            }
        }
    }   

};

app.ticker.add(delta => gameLoop(delta));