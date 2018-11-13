
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


//@property
maxTravelDuration: number = 3;

rotSpeed: number = 10;

    onLoad ()
    {
        cc.audioEngine.playEffect(this.getComponent(cc.AudioSource).clip, false);
        //this.getComponent(cc.AudioSource).volume = this.node.getParent().getComponent("MouseScript").AudioLevel;
    }

    start () {

    }

    update (dt)
    {
        this.node.setRotation(this.node.rotation += this.rotSpeed);
    }

    public beerCanMovement(tgtLocation: cc.Vec2, jumpHeight: number)
    {
        var parentHeight = this.node.getParent().height;

        // offset value because we're coming up short
        jumpHeight += 200;

        // converting world space of mouse position to node space of beer can position
        var newTgtLoc = this.node.getParent().convertToNodeSpaceAR(tgtLocation);
 
        // normalizing velocity based on distance to travel
        var timeToTarget = this.maxTravelDuration * ((jumpHeight-200)/parentHeight);

        // shift target x position so that height of jump passes through target x position
        var dist = newTgtLoc.x - this.node.position.x;

        // define movement action parameters
        var action = cc.jumpTo(timeToTarget, newTgtLoc.x+dist, -(this.node.getParent().height), jumpHeight, 1);//.easing(cc.easeInOut(1));

        // execute movement
        this.node.runAction(action);
    }
}
