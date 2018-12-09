
const {ccclass, property} = cc._decorator;

@ccclass
export default class BeerCan extends cc.Component {


@property(cc.AudioSource)
_audioSource: cc.AudioSource = null;

//@property
maxTravelDuration: number = 1.5;

initialized: boolean = false;
destination: cc.Vec2;
direction: cc.Vec2 = new cc.Vec2();
moveSpeed: number = 1000;

@property
explosionDelay: number = 0.25;

rotSpeed: number = 15;

    //onLoad () {}

    //start ()   {}

    update (dt)
    {
        if (this.initialized)
        {
            // rotate the can
            this.node.children[0].rotation = (this.node.children[0].rotation += this.rotSpeed);

            this.node.position = this.node.position.add(this.direction.mul(this.moveSpeed * dt));

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

        // converting world space of mouse position to node space of beer can position
        var convertedTargetLoc = this.node.getParent().convertToNodeSpaceAR(tgtLocation);
 
        // calculate full trajectory through click point
        var calculatedTargetLoc = this.CalculateTrajectory(convertedTargetLoc);

        this.destination = calculatedTargetLoc;
		this.direction = calculatedTargetLoc.sub(this.node.position);
        this.direction.normalizeSelf();

        // initialize variables that help determine when can has reached its destination
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
       console.log(newTgtLoc.x + "," + newTgtLoc.y);
        return newTgtLoc;
    }
}
