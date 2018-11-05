
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //on event hanlder for globally available
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

onKeyDown(e:cc.Event.EventKeyboard)
{
  
    console.log("Key Down: " + e.keyCode);
}

onKeyUp(e:cc.Event.EventKeyboard)
{
    console.log("Key Up: " + e.keyCode);
}

    onLoad()
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    }

    start () {

    }

    // update (dt) {}
}
