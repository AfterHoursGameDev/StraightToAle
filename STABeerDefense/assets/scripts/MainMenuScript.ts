
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuScript extends cc.Component {

    @property(cc.Node)
    tutorialNode: cc.Node = null;

    @property(cc.Node)
    creditsNode: cc.Node = null;

    @property(cc.Node)
    leaderboardNode: cc.Node = null;

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
    }

    public TutorialClick()
    {
        this.tutorialNode.active = true;

        this.tutorialNode.getComponent("TutorialScript").ResetPosition();
    }

    public CreditsClick()
    {
        this.creditsNode.active = true;
    }
}
