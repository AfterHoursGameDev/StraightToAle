
const {ccclass, property} = cc._decorator;

@ccclass
export default class Pitcher extends cc.Component {

    initialized: boolean = false;
    destination: cc.Vec2;

    //@property
    maxTravelDuration: number = 2.5;

    @property
    explosionDelay: number = 0.25;

    @property
    explosionRadius: number = 400;

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        //cc.director.getCollisionManager().enabledDrawBoundingBox;
     }

    start () {

    }

    update (dt)
    {
        if (this.initialized)
        {
            if (Math.round(this.node.position.x) == Math.round(this.destination.x) && Math.round(this.node.position.y) == Math.round(this.destination.y))
            {
                this.initialized = false;

                this.pitcherExplosion();
            }
        }
    }

    pitcherExplosion()
    {
        var cirMultiplier = 10;
        //var cirMaxRadius = 200;
        var i = 0;
        var cirCollider = this.node.addComponent(cc.CircleCollider);

        for (i = 0; i <= this.explosionRadius; i += cirMultiplier)
        {
            cirCollider.radius += cirMultiplier;
        }

        this.scheduleOnce(this.DestroyNode, this.explosionDelay);
    }

    DestroyNode()
    {
        this.node.destroy();
    }

    public pitcherMovement(tgtLocation: cc.Vec2, jumpHeight: number)
    {
        var parentHeight = this.node.getParent().height;

        // offset value because we're coming up short
        jumpHeight += 200;

        // converting world space of mouse position to node space of beer can position
        var newTgtLoc = this.node.getParent().convertToNodeSpaceAR(tgtLocation);
 
        // normalizing velocity based on distance to travel
        var timeToTarget = this.maxTravelDuration * ((jumpHeight-200)/parentHeight);

        // shift target x position so that height of jump passes through target x position
        newTgtLoc.x -= this.node.position.x;

        // define movement action parameters
        var action = cc.jumpTo(timeToTarget, newTgtLoc.x, newTgtLoc.y, 0.5, 1);
        var action2 = cc.callFunc(this.pitcherExplosion);

        // execute movement
        this.node.runAction(action);

        this.destination = newTgtLoc;
        this.initialized = true;
    }
}
