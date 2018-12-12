
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuScript extends cc.Component {

    @property(cc.Node)
    instructionNode: cc.Node = null;

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
        
    }

    public InstructionsClick()
    {
        this.instructionNode.active = true;
    }
}
