
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property (cc.CircleCollider)
    cirCollider: cc.CircleCollider = null;

    explosionDelay: number = 0.25;

    explosionRadius: number = 150;

    onLoad () {
        this.ActivatePowerUpExplosion();
    }

    start () {

    }

    // update (dt) {}

    ActivatePowerUpExplosion()
    {
        console.log("Activating Power Up Explosion");
        var cirMultiplier = 10;
        //var cirMaxRadius = 200;
        var i = 0;

        for (i = 0; i <= this.explosionRadius; i += cirMultiplier)
        {
            this.cirCollider.radius += cirMultiplier;
        }

        this.scheduleOnce(this.DestroyThisNode, this.explosionDelay);
    }

    DestroyThisNode()
    {
        this.node.destroy();
    }
}
