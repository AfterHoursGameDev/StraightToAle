import BaseMovementComponent from "./BaseMovementScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpiralMovementComponent extends BaseMovementComponent
{


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
	{
    }

    update (dt)
	{
	}
	
	public setDestination(targetLocation: cc.Vec2)
    {	

    }
}
