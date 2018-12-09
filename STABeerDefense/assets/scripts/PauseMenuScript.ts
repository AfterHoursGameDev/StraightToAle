
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad ()
    {
        this.node.active = false;
    }

    start ()
    {
        
    }

    // update (dt) {}

    public PauseGameButton()
    {
        this.PlayClickAudio();

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

    public UpdateVolume()
    {
		cc.log('update volume');
        console.log(cc.audioEngine.getMusicVolume());
        if (cc.audioEngine.getMusicVolume() == 1)
        {
            cc.audioEngine.setMusicVolume(0);
        }
        else
        {
            cc.audioEngine.setMusicVolume(1);
        }

        if (cc.audioEngine.getEffectsVolume() == 1)
        {
            cc.audioEngine.setEffectsVolume(0);
        }
        else
        {
            cc.audioEngine.setEffectsVolume(1);
        }

        this.PlayClickAudio();
    }

    public RestartLevelButton()
    {
        this.PlayClickAudio();

        cc.director.loadScene("endless_mode");
    }

    public HomeButton()
    {
        this.PlayClickAudio();

        cc.director.loadScene("main_menu");
    }

    PlayClickAudio()
    {
        cc.audioEngine.playEffect(this.getComponent(cc.AudioSource).clip, false);
    }
}
