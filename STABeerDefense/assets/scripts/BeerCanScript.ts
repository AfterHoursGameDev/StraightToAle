
const {ccclass, property} = cc._decorator;

@ccclass
export default class BeerCan extends cc.Component {


@property(cc.AudioSource)
_audioSource: cc.AudioSource = null;

//@property
maxTravelDuration: number = 1.5;

initialized: boolean = false;
destination: cc.Vec2;

@property
explosionDelay: number = 0.25;

rotSpeed: number = 15;

    //onLoad () {}

    //start ()   {}

    update (dt)
    {
        this.node.children[0].rotation = (this.node.children[0].rotation += this.rotSpeed);

        if (this.initialized)
        {
            if (Math.round(this.node.position.x) == Math.round(this.destination.x) && Math.round(this.node.position.y) == Math.round(this.destination.y))
            {
                this.initialized = false;

                // delay before destroying projectile
                // may not be needed
                // this.scheduleOnce(this.DestroyNode, this.explosionDelay);
                this.DestroyNode();
            }
        }
    }

    DestroyNode()
    {
        this.node.destroy();
    }

    public beerCanMovement(tgtLocation: cc.Vec2, jumpHeight: number)
    {
        var parentHeight = this.node.getParent().height;

        cc.audioEngine.playEffect(this.getComponent(cc.AudioSource).clip, false);

        // offset value because we're coming up short
        // required for jump functionality
        jumpHeight += 200;

        // converting world space of mouse position to node space of beer can position
        var newTgtLoc = this.node.getParent().convertToNodeSpaceAR(tgtLocation);
 
        // calculate full trajectory through click point
        newTgtLoc = this.CalculateTrajectory(newTgtLoc)

        // normalizing velocity based on distance to travel
        // required for jump functionality
        //var timeToTarget = this.maxTravelDuration * ((jumpHeight-200)/parentHeight);

        // shift target x position so that height of jump passes through target x position
        // required for jump functionality
        var dist = newTgtLoc.x - this.node.position.x;

        // define movement action parameters
        // var action = cc.jumpTo(timeToTarget, newTgtLoc.x+dist, -(this.node.getParent().height), jumpHeight, 1);//.easing(cc.easeInOut(1));
        var action = cc.moveTo(this.maxTravelDuration, newTgtLoc);//.easing(cc.easeInOut(1));

        // execute movement
        this.node.runAction(action);

        // initialize variables that help determine when can has reached its destination
        this.destination = newTgtLoc;
        this.initialized = true;
    }

    CalculateTrajectory = function(tgtLocation: cc.Vec2)
    {
        var newTgtLoc = new cc.Vec2;

        // m = y2-y1 / x2-x1
        var m = (this.node.position.y - tgtLocation.y) / (this.node.position.x - tgtLocation.x);
        // console.log("Slope: " + m);

        // b = y / mx
        var b = tgtLocation.y / (m * tgtLocation.x);
        // console.log("Intercept: " + b);

        // x = y-b/m
        newTgtLoc.x = (this.node.getParent().height - b)/m;
        newTgtLoc.y = this.node.getParent().height;

        return newTgtLoc;
    }
}
