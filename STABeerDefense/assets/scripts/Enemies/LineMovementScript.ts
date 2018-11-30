
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component 
{

    destination: cc.Vec2;
	startLocation: cc.Vec2;
	
	direction: cc.Vec2;

	@property
    enemyMoveSpeed: number = 10;
	
	initialized: boolean = false;

    // onLoad () 
	// {	
	// }

    start () 
	{
		this.startLocation = this.node.position;
    }

    update (dt) 
	{
		if (this.initialized)
		{
			this.node.position = this.node.position.add(this.direction.mul(this.enemyMoveSpeed * dt));
		}
	}
	
	public setTargetTank(targetLocation: cc.Vec2)
    {	
		this.direction = targetLocation.sub(this.node.position);
		cc.log(this.direction.toString());
		this.direction.normalizeSelf();
		
		this.initialized = true;
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

        // // stop the current movement action
        // this.node.stopAction(this.action);

        // // move enemy off-screen
        // // TODO: enable screen exit animation
        // this.action = cc.moveTo(this.enemyMoveSpeed/4, xLoc, this.node.position.y);

        // // execute can movement
        // this.node.runAction(this.action);

        // // TODO: Need to wait for movement complete before destroying
        // // this.node.destroy();
    }
}
