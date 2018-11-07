
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


@property
maxDuration: number = 3;

rotSpeed: number = 7;

    // onLoad () {}

    start () {

    }

    update (dt)
    {
        this.node.setRotation(this.node.rotation += this.rotSpeed);
    }

    public beerCanMovement(tgtLocation: cc.Vec2, jumpHeight: number)
    {
        var parentHeight = this.node.getParent().height;

        // converting world space of mouse position to node space of beer can position
        var newTgtLoc = this.node.getParent().convertToNodeSpaceAR(tgtLocation);
 
        // normalizing velocity based on distance to travel
        var vel = this.maxDuration * ((jumpHeight + 200)/parentHeight);

        // shift target x position so that height of jump passes through target x position
        var dist = newTgtLoc.x - this.node.position.x;

        // define movement action parameters
        var action = cc.jumpTo(vel, newTgtLoc.x+dist, -(this.node.getParent().height), (jumpHeight + 200), 1);

        // execute movement
        this.node.runAction(action);
    }
}
