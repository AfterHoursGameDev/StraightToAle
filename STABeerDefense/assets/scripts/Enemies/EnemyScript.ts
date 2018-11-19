/**
 *	Behavior script for the basic enemy type.
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component 
{

    horOffset: number = 0;// 375;
    tankHealthModifier: number = 1;
    tankSelected: cc.Node = null;
    destination: cc.Vec2;

    enemyMoveSpeed: number = 10;
    initialized: boolean = false;

    action: cc.ActionInterval;
	
	@property
	pointValue: number = 5;

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

                this.EnemyChangeTarget();
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
                this.EnemyExitScreen();
                this.node.getParent().getComponent("GameManagerScript").UpdateScore(this.pointValue);
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
            case "pitcher":
            {
                // destroy the pitcher
                other.node.destroy();

                // TODO: disable collider and have enemy exit screen to right or left
                this.EnemyExitScreen();
                this.node.getParent().getComponent("MouseScript").UpdateScore(this.pointValue);
                break;
            }
        }
    }

    public EnemyMovement(selectedTank: cc.Node)
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

    EnemyChangeTarget()
    {
        var newTarget = new cc.Node;

        newTarget = this.node.getParent().getComponent("GameManagerScript").UpdateEnemyTarget();

        if (newTarget != null)
        {
            this.node.stopAction(this.action);

            this.EnemyMovement(newTarget);
        }
        else
        {
            this.EnemyExitScreen();
        }
    }

    public EnemyExitScreen()
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