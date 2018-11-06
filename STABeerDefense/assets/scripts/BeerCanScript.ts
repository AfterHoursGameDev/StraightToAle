
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


@property
beerCanSpeed: number = 7;

    // onLoad () {}

    start () {

    }

    update (dt)
    {
        this.node.setRotation(this.node.rotation += this.beerCanSpeed);
    }

    public beerCanMovement(tgtLocation: cc.Vec2)
    {
        var action = cc.jumpTo(3, tgtLocation.x, -(this.node.getParent().height), tgtLocation.y-450, 1);

        // execute can movement
        this.node.runAction(action);
    }
}
