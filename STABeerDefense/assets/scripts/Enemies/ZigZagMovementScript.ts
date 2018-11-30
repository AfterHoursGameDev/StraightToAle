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
