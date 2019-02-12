
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property (cc.Sprite)
    playerIcon: cc.Sprite = null;

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    playerScore: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    UpdatePlayerInfo(icon: cc.Texture2D, name: string, score: string)
    {
        this.playerIcon.spriteFrame.setTexture(icon);
        this.playerName.string = name;
        this.playerScore.string = score.toString();
    }
}
