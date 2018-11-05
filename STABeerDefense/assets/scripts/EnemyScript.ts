
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    horOffset: number = 0;// 375;
    tankHealthModifier: number = 0.2;
    tankSelected: cc.Node = null;

    enemyMoveSpeed: number = 10;

    destination: cc.Vec2;

    action: cc.ActionInterval;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
/*
        this.node.on('ferm_tank_destroyed', (e: cc.Event) =>
        {
            if (e.target == this.tankSelected)
            {
                console.log(e.target.name + " has been destroyed.");
            }
        });*/

        //this.enemyMovement();
    }

    start ()
    {
        //this.node.dispatchEvent(new cc.Event.EventCustom('enemySatisfied', true));
    }

    update (dt)
    {
        /*
        if (this.node.position.y >= this.destination.y - 5 && this.node.position.y <= this.destination.y + 5)
        {
            this.node.destroy;
        }*/
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
                    //this.node.dispatchEvent(new cc.Event.EventCustom('ferm_tank_destroyed', true));
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
        this.action = cc.moveTo(this.enemyMoveSpeed/2, xLoc, this.node.position.y);

        // execute can movement
        this.node.runAction(this.action);

        // TODO: Need to wait for movement complete before destroying
        // this.node.destroy();
    }
}
