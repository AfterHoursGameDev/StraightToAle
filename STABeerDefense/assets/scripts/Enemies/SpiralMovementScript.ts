// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component 
{


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
	
	
	public setTargetTank(selectedTank: cc.Node)
    {
        // reference to tank selected as a target so that we can determine when it is destroyed
        this.tankSelected = selectedTank;

        // initialize the script to look for when the tank is destroyed
        this.initialized = true;

        // define movement action parameters
        //var action = cc.moveTo(this.enemyMoveSpeed, this.node.position.x, -(this.node.getParent().height));
        this.action = cc.moveTo(this.enemyMoveSpeed, selectedTank.x, selectedTank.y);

        // execute can movement
        this.node.runAction(this.action);
    }
}
