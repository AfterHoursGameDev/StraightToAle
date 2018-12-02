
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
	//direction: cc.Vec2;
	
	
    update (dt) 
	{
		if (this.hasTarget)
		{
			this.node.position = this.node.position.add(this.direction.mul(this.enemyMoveSpeed * dt));
			
			// Check and see if we've gone past our target.
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
}
