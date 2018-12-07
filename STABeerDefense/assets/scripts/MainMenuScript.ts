
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuScript extends cc.Component {

    onLoad ()
    {
        
    }

    start () {

    }

    // update (dt) {}

    public EndlessModeClick()
    {
        //cc.game.addPersistRootNode(this.node);
        cc.director.loadScene("endless_mode");
    }

    LoadScene(modeSelected: cc.Toggle)
    {
        switch (modeSelected.getComponentInChildren(cc.Label).string)
        {
            case "Endless Mode":
            {
                cc.director.loadScene("endless_mode");
                break;
            }
        }
    }
}
