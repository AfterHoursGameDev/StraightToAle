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
	
	@property
	pointValue: number = 5;
	
	movementComponent: cc.Component;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        // turn on collision
        cc.director.getCollisionManager().enabled = true;
		
		// If these had a shared parent class we could just get this by the parent class and let
		// polymorphism handle things, but alas.
		this.movementComponent = this.node.getComponent("LineMovementScript");
		if (!this.movementComponent)
		{
			this.movementComponent = this.node.getComponent("ZigZagMovementScript");
			if (!this.movementComponent)
			{
				this.movementComponent = this.node.getComponent("SpiralMovementScript");
			}
		}	
		
		if (!this.movementComponent)
		{
			cc.log('Error! No movement component was found!');
		}
    }

    start ()
    {

    }

    update (dt)
    {
		// if we want to deny the player points for losing this thing's target by making
		// it leave, here's that.
		if (this.tankSelected == null)
		{
			this.movementComponent.exitScreen();
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

                // disable collider and have enemy exit screen to right or left
				cc.director.getCollisionManager().enabled = false;
                this.movementComponent.exitScreen();
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

                // disable collider and have enemy exit screen to right or left
				cc.director.getCollisionManager().enabled = false;
                this.movementComponent.exitScreen();
                this.node.getParent().getComponent("MouseScript").UpdateScore(this.pointValue);
                break;
            }
			case "KillVolume"
			{
				// destroy this enemy, we've exited the screen.
                this.node.destroy();
				break;
			}
        }
    }

    public setTargetTank(selectedTank: cc.Node)
    {
        // reference to tank selected as a target so that we can determine when it is destroyed
        this.tankSelected = selectedTank;	
		
		if (this.movementComponent)
		{
			this.movementComponent.setDestination(selectedTank.position);
		}
    }
}
