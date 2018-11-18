
const {ccclass, property} = cc._decorator;

@ccclass
export default class BeerCan extends cc.Component {


//@property
maxTravelDuration: number = 1.25;

initialized: boolean = false;
destination: cc.Vec2;

@property
explosionDelay: number = 0.25;

rotSpeed: number = 15;

    onLoad ()
    {
        cc.audioEngine.playEffect(this.getComponent(cc.AudioSource).clip, false);
        //this.getComponent(cc.AudioSource).volume = this.node.getParent().getComponent("MouseScript").AudioLevel;
    }

    start () {        
    }

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

        // offset value because we're coming up short
        jumpHeight += 200;

        // converting world space of mouse position to node space of beer can position
        var newTgtLoc = this.node.getParent().convertToNodeSpaceAR(tgtLocation);
 
        // normalizing velocity based on distance to travel
        var timeToTarget = this.maxTravelDuration * ((jumpHeight-200)/parentHeight);

        // shift target x position so that height of jump passes through target x position
        var dist = newTgtLoc.x - this.node.position.x;

        // define movement action parameters
        // var action = cc.jumpTo(timeToTarget, newTgtLoc.x+dist, -(this.node.getParent().height), jumpHeight, 1);//.easing(cc.easeInOut(1));
        var action = cc.moveTo(timeToTarget, newTgtLoc);//.easing(cc.easeInOut(1));

        // execute movement
        this.node.runAction(action);

        this.destination = newTgtLoc;
        this.initialized = true;
    }

    CalculateTrajectory(tgtLocation: cc.Vec2)
    {
        // m = y2-y1 / x2-x1
        var m = (this.node.position.y - tgtLocation.y) / (this.node.position.x - tgtLocation.x);
        console.log("Slope: " + m);
//y = mx + b
        // b = y / mx
        var b = tgtLocation.y / (m * tgtLocation.x);
        console.log("Intercept: " + b);
    }
}
