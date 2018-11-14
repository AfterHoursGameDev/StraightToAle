
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuScript extends cc.Component {

    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;

    onLoad ()
    {

    }

    start () {

    }

    // update (dt) {}

    public StartButtonClick()
    {
        var toggles = this.toggleContainer.toggleItems;

        for(var i = 0; i < toggles.length; i++)
        {
            if (toggles[i].isChecked)
            {
                this.LoadScene(toggles[i]);
                console.log(toggles[i].getComponentInChildren(cc.Label).string);
            }
        }
    }

    LoadScene(modeSelected: cc.Toggle)
    {
        switch (modeSelected.getComponentInChildren(cc.Label).string)
        {
            case "Endless Mode":
            {
                cc.director.loadScene("main");
                break;
            }
        }
    }
}
