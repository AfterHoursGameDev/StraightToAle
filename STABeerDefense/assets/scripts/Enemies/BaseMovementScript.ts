
const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseMovementComponent extends cc.Component {

   	hasTarget: boolean = false;
	
	destination: cc.Vec2;
	startLocation: cc.Vec2;

	// pixels per second, probably.
	@property
    enemyMoveSpeed: number = 100;
	
	// Want to make sure the enemy moves the same relative speed on different resolutions
	movementResolutionScale: number = 0;
	designHeight: number = 1334;
	
	direction: cc.Vec2;
	
	
	onLoad () 
	{
		this.startLocation = this.node.position;	
		
		// speed assuming height of 1334 covers a certain percentage of the screen.
		// Scale the movement speed so that it covers the same percentage of screen on screens of other heights.
		this.movementResolutionScale = this.node.getParent().height / this.designHeight;
		this.enemyMoveSpeed *= this.movementResolutionScale;
	}
	

    public setDestination(targetLocation: cc.Vec2)
    {			
		cc.log(this.getName() + " didn't implement setDestination");
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
		this.setDestination(targetLoc);
    }
}
