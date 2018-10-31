
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


@property
beerCanSpeed: number = 7;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt)
    {
        this.node.setRotation(this.node.rotation += this.beerCanSpeed);
    }
}
