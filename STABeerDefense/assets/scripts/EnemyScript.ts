
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    horOffset: number = 0;// 375;
    tankHealthModifier: number = 0.2;
    tankSelected: cc.Node = null;
    destination: cc.Vec2;

    enemyMoveSpeed: number = 10;
    initialized: boolean = false;

    action: cc.ActionInterval;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        // turn on collision
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    }

    start ()
    {
        //this.node.dispatchEvent(new cc.Event.EventCustom('enemySatisfied', true));
    }

    update (dt)
    {
        if (this.initialized)
        {
            if (this.tankSelected.isValid == false)
            {
                this.initialized = false;

                this.enemyExitScreen();
            }
        }
    }

    onCollisionEnter (other: cc.Collider, self)
    {
        switch (other.node.name)
        {
            case "beerCan":
            {
                // destroy the beer can
                other.node.destroy();

                // destroy this enemy
                // TODO: disable collider and have enemy exit screen to right or left
                this.enemyExitScreen();
                //this.node.destroy();
                break;
            }
            case "fermentation_tank":
            {
                // reduce the "health" of the tank using the fill
                other.node.getComponent(cc.Sprite).fillStart -= this.tankHealthModifier;

                // check to see if tank's health is reduced to 0
                if (other.node.getComponent(cc.Sprite).fillStart <= -1)
                {
                    // if tank is empty, disable collider box
                    // replace sprite with destroyed sprite?
                    other.node.getComponent(cc.BoxCollider).enabled = false;

                    other.node.destroy();
                }

                // destroy this enemy
                this.node.destroy();
                break;
            }
        }
    }

    public enemyMovement(selectedTank: cc.Node)
    {
        // reference to tank selected as a target so that we can determine when it is destroyed
        this.tankSelected = selectedTank;

        // initialize the script to look for when the tank is destroyed
        this.initialized = true;

        // define movement action parameters
        //var action = cc.moveTo(this.enemyMoveSpeed, this.node.position.x, -(this.node.getParent().height));
        this.action = cc.moveTo(this.enemyMoveSpeed, selectedTank.x, selectedTank.y);

        // execute can movement
        this.node.runAction(this.action);
    }

    public enemyExitScreen()
    {
        this.node.getComponent(cc.BoxCollider).enabled = false;

        var xLoc = 0;

        if(this.node.position.x >= 0)
        {
            xLoc = this.node.getParent().width + this.node.width + 20;
        }
        else
        {
            xLoc = -(this.node.getParent().width) - this.node.width - 20;
        }

        // stop the current movement action
        this.node.stopAction(this.action);

        // move enemy off-screen
        // TODO: enable screen exit animation
        this.action = cc.moveTo(this.enemyMoveSpeed/4, xLoc, this.node.position.y);

        // execute can movement
        this.node.runAction(this.action);

        // TODO: Need to wait for movement complete before destroying
        // this.node.destroy();
    }
}
