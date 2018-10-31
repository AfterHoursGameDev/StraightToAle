
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.getComponent(cc.Animation).play("walk");
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,(e:cc.Event.EventKeyboard)=>
        {
            if(e.keyCode == cc.macro.KEY.space){
                if(this.getComponent(cc.Animation).getAnimationState("walk").isPaused)
                {
                    this.getComponent(cc.Animation).getAnimationState("walk").play();
                }
                else
                {
                    this.getComponent(cc.Animation).getAnimationState("walk").pause();
                }
            }
        }, this);
    }

    halfway()
    {
        console.log("Halfway there baby");
    }

    // update (dt) {}
}
