
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
	

    start () 
	{
    }

    public setDestination(targetLocation: cc.Vec2)
    {			
		cc.log("Child movement component didn't implement setDestination");
    }
	
	public exitScreen()
	{
		cc.log("Child movement component didn't implement exitScreen");
	}
}
