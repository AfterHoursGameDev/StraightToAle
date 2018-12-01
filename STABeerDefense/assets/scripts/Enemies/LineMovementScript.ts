
const {ccclass, property} = cc._decorator;

@ccclass
export default class LineMovementScript extends cc.Component 
{

    destination: cc.Vec2;
	startLocation: cc.Vec2;
	
	direction: cc.Vec2;

	// pixels per second, probably.
	@property
    enemyMoveSpeed: number = 100;
	
	// Want to make sure the enemy moves the same relative speed on different resolutions
	movementResolutionScale: number = 0;
	designScale: number = 1334;
	designAspectRatio: number = 0.562;
	
	hasTarget: boolean = false;

    onLoad () 
	{
		this.startLocation = this.node.position;	
		
		// 100 pixels per second assuming height of 1334 covers a certain percentage of the screen
		// scale the movement speed so that it covers the same percentage of screen on screens of other heights.
		this.movementResolutionScale = this.node.getParent().height/this.designScale;
		this.enemyMoveSpeed *= this.movementResolutionScale;
	}

    start () 
	{
		 
    }

    update (dt) 
	{
		if (this.hasTarget)
		{
			this.node.position = this.node.position.add(this.direction.mul(this.enemyMoveSpeed * dt));
			
			var directionToDestination = this.destination.sub(this.node.position);
			
			if (directionToDestination.dot(this.direction) < 0)
			{
				// then we've reached our destination, stop
				this.node.position = this.destination;
				this.hasTarget = false;
			}
		}
	}
	
	public setDestination(targetLocation: cc.Vec2)
    {	
		this.destination = targetLocation;
		this.direction = targetLocation.sub(this.node.position);
		this.direction.normalizeSelf();
		
		cc.log("start " + this.node.position.toString() + "direction " + this.direction.toString() + "destination " + targetLocation.toString());
		
		this.hasTarget = true;
    }
	
	public exitScreen()
    {
        var xLoc = 0;
		cc.log('exiting screen');

        if(this.node.position.x >= 0)
        {
            xLoc = this.node.getParent().width + this.node.width + 20;
        }
        else
        {
            xLoc = -(this.node.getParent().width) - this.node.width - 20;
        }
		
		var targetLoc = new cc.Vec2(xLoc, this.node.y);
		cc.log(targetLoc.toString());
		this.setDestination(targetLoc);
    }
}
