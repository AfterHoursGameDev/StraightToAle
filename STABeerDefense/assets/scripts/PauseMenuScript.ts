
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

@property(cc.Toggle)
muteToggle: cc.Toggle = null;

@property(cc.Toggle)
pauseToggle: cc.Toggle = null;

backgroundMusicVol: number = 1;
effectsVol: number = 1;

    onLoad ()
    {/*
        // touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_START, (e: cc.Touch)=>
        {
            // Update the toggle state
            //this.pauseToggle.isChecked = true;

            //this.PauseGameButton();
        })*/

        // Check state of mute toggle
        if (cc.audioEngine.getMusicVolume() == this.backgroundMusicVol)
        {
            this.muteToggle.isChecked = true;
        }
        else
        {
            this.muteToggle.isChecked = false;
        }

        // Deactivate Pause menu until it is called
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
        if (cc.audioEngine.getMusicVolume() == this.backgroundMusicVol)
        {
            cc.audioEngine.setMusicVolume(0);
        }
        else
        {
            cc.audioEngine.setMusicVolume(this.backgroundMusicVol);
        }

        if (cc.audioEngine.getEffectsVolume() == this.effectsVol)
        {
            cc.audioEngine.setEffectsVolume(0);
        }
        else
        {
            cc.audioEngine.setEffectsVolume(this.effectsVol);
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
        cc.director.resume();

        this.PlayClickAudio();

        cc.director.loadScene("endless_mode");
    }

    public HomeButton()
    {
        cc.director.resume();

        this.PlayClickAudio();

        cc.director.loadScene("main_menu");
    }

    PlayClickAudio()
    {
        cc.audioEngine.playEffect(this.getComponent(cc.AudioSource).clip, false);
    }
}
