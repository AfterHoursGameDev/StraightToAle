
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

@property(cc.Node)
mainMenuCanvas: cc.Node = null;

    public HomeButtonClick()
    {
        this.mainMenuCanvas.active = true;
        this.node.active = false;
    }
}
