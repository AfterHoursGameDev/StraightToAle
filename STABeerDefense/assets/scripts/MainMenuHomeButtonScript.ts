
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    public HomeButtonClick()
    {
        this.node.active = false;
    }
}
