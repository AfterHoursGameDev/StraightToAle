
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

@property(cc.Toggle)
muteToggle: cc.Toggle = null;

    onLoad ()
    {
        if (cc.audioEngine.getMusicVolume() == 1)
        {
            //this.muteToggle.checkMark.enabled = true;
            this.muteToggle.isChecked = true;
        }
        else
        {
            this.muteToggle.isChecked = false;
            //this.muteToggle.checkMark.enabled = false;
        }

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

    public PauseBGMButton()
    {
        if (cc.audioEngine.isMusicPlaying() == true)
        {
            cc.audioEngine.pauseMusic();
        }
        else
        {
            cc.audioEngine.resumeMusic();
        }
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
