const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioSource)
    gameOverAudioEffect: cc.AudioSource = null;

    onLoad ()
    {
        this.node.active = false;
    }

    start () {

    }

    // update (dt) {}

    public ShowGameOverScreen()
    {
        cc.audioEngine.playEffect(this.gameOverAudioEffect.clip, false);

        this.scheduleOnce(function()
        {
            cc.director.loadScene("main_menu");
        }, 5)
    }
}
