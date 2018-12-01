
const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseMovementComponent extends cc.Component {

   	hasTarget: boolean = false;

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
