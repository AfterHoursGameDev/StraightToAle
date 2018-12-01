
import BaseMovementComponent from "./BaseMovementScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LineMovementScript extends BaseMovementComponent
{
	
	/** inherited vars */
    //destination: cc.Vec2;
	//startLocation: cc.Vec2;
    // enemyMoveSpeed: number = 100;
	//movementResolutionScale: number = 0;
	//designHeight: number = 1334;
	//hasTarget: boolean = false;
	
	
	direction: cc.Vec2;
	
    onLoad () 
	{
		this.startLocation = this.node.position;	
		
		// store this so we don't have to get it 3 times.
		var canvas = this.node.getParent();
		
		// speed assuming height of 1334 covers a certain percentage of the screen.
		// Scale the movement speed so that it covers the same percentage of screen on screens of other heights.
		this.movementResolutionScale = canvas.height / this.designHeight;
		this.enemyMoveSpeed *= this.movementResolutionScale;
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
		
		this.hasTarget = true;
    }
	
	public exitScreen()
    {
        var xLoc = 0;

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
