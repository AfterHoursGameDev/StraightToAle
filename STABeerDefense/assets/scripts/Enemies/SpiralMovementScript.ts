import BaseMovementComponent from "./BaseMovementScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpiralMovementComponent extends BaseMovementComponent
{

	/** inherited vars */
    //destination: cc.Vec2;
	//startLocation: cc.Vec2;
    // enemyMoveSpeed: number = 100;
	//movementResolutionScale: number = 0;
	//designHeight: number = 1334;
	//hasTarget: boolean = false;
	
	
	period: number = 1.5; // seconds for a full sine cycle
	deltaTime: number = 0; // time since start of cycle.
	@property
	amplitude: number = 120;
	
	linePosition: cc.Vec2;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    update (dt)
	{
		if (this.hasTarget)
		{
			//cc.log("pos " + this.linePosition.toString() + " dir " + this.direction.toString() + " move speed " + this.enemyMoveSpeed + " dt " + dt);
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
			var newPosition = new cc.Vec2();
			newPosition.x = this.linePosition.x + this.amplitude * Math.cos(this.deltaTime / this.period * 2 * Math.PI);
			newPosition.y = this.linePosition.y + this.amplitude * Math.sin(this.deltaTime / this.period * 2 * Math.PI);
			
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
		
		this.hasTarget = true;
    }
}
