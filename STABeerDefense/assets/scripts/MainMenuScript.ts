
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuScript extends cc.Component {

    @property(cc.Node)
    tutorialNode: cc.Node = null;

    @property(cc.Node)
    creditsNode: cc.Node = null;

    @property(cc.Node)
    leaderboardNode: cc.Node = null;

    backgroundMusicVol: number = 1;
    effectsVol: number = 1;

    onLoad ()
    {
        // resume game if it's paused
        if (cc.director.isPaused())
        {
            cc.director.resume();
        }
    }

    start () {

    }

    // update (dt) {}

    public EndlessModeClick()
    {
        // load the Endless Mode Scene
        cc.director.loadScene("endless_mode");
    }

    public LeaderboardClick()
    {
        //this.leaderboardNode.active = true;

        //this.DisableMainMenu();
    }

    public TutorialClick()
    {
        this.tutorialNode.active = true;

        this.tutorialNode.getComponent("TutorialScript").ResetPosition();

        this.DisableMainMenu();
    }

    public CreditsClick()
    {
        this.creditsNode.active = true;

        this.DisableMainMenu();
    }

    public UpdateVolume()
    {
		cc.log('update volume');

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
    }

    DisableMainMenu()
    {
        this.node.active = false;
    }
}
