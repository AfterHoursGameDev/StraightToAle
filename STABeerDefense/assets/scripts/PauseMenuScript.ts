
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad ()
    {
        this.node.active = false;
    }

    start () {

    }

    // update (dt) {}

    public PauseGameButton()
    {
        if (cc.director.isPaused() == false)
        {
            this.node.active = true;
            cc.director.pause();
        }
        else
        {
            this.node.active = false;
            cc.director.resume();
        }
    }
}
