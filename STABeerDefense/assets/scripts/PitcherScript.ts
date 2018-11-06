
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    initialized: boolean = false;
    destination: cc.Vec2;

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        cc.director.getCollisionManager().enabled = true;
     }

    start () {

    }

    update (dt)
    {
        if (this.initialized)
        {
            if (this.node.position == this.destination)
            {
                this.initialized = false;

                this.pitcherExplosion();
            }
        }
    }

    pitcherExplosion()
    {
        var cirMultiplier = 1;
        var cirMaxRadius = 100;
        var i = 0;
        var cirCollider = this.node.addComponent(cc.CircleCollider);

        for (i = 0; i <= cirMaxRadius; i += 10)
        {
            cirCollider.radius += cirMultiplier;
        }
        
    }

    public pitcherMovement(tgtLocation: cc.Vec2)
    {
        this.destination = tgtLocation;

        this.initialized = true;

        var action = cc.jumpTo(3, tgtLocation.x, -(this.node.getParent().height), tgtLocation.y-450, 1);

        // execute can movement
        this.node.runAction(action);
    }
}
