import BaseMovementComponent from "./BaseMovementScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZigZagMovementComponent extends BaseMovementComponent
{
	/** inherited vars */
    //destination: cc.Vec2;
	//startLocation: cc.Vec2;
    // enemyMoveSpeed: number = 100;
	//movementResolutionScale: number = 0;
	//designHeight: number = 1334;
	//hasTarget: boolean = false;
	//direction: cc.Vec2;
		
	period: number = 1.5; // seconds for a full sine cycle
	deltaTime: number = 0; // time since start of cycle.
	@property
	amplitude: number = 120;
	
	linePosition: cc.Vec2;
	
	
	
	
    // LIFE-CYCLE CALLBACKS:	
	update(dt)
	{		
		if (this.hasTarget)
		{
			// update the position on the line we are "sine-ing" around.
			this.linePosition.addSelf(this.direction.mul(this.enemyMoveSpeed * dt));
			

			this.deltaTime += dt;
			
			if (this.deltaTime > this.period)
			{
				// don't set it back to 0 because we don't actually want to get
				// rid of any extra time beyond that for a smooth curve.
				this.deltaTime -= this.period;
			}
			// calculate our offset from the line using fun math times.
			// Use the perpendicular-to-the-direction (i.e. swap x and y) normalized 
			// vector to project the sine wave onto the line, i.e. calculate what percentage of the 
			// sineResult affects the x position and what percentage affects the y position. 
			var newPosition = new cc.Vec2();
			var sineResult = this.amplitude * Math.sin(this.deltaTime / this.period * 2 * Math.PI);
			newPosition.x = this.linePosition.x + this.direction.y * sineResult;
			newPosition.y = this.linePosition.y + this.direction.x * sineResult;
			
			this.node.position = newPosition;
			
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
		this.direction = targetLocation.sub(this.startLocation);
		this.direction.normalizeSelf();
		
		this.linePosition = this.startLocation;
		// reset this here in case this isn't the first time this funciton is being called.
		this.deltaTime = 0;

		this.hasTarget = true;
    }
}
