
const {ccclass, property} = cc._decorator;

@ccclass
export default class MuteButton extends cc.Component {

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    // changes sprite
    public UpdateButton()
    {
        /*
        // display normal vs muted icon based on current sprite icon
        if (this.node.getComponent(cc.Sprite).spriteFrame == this.node.getComponent(cc.Button).normalSprite)
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(cc.Button).disabledSprite;
        }
        else
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(cc.Button).normalSprite;
        }*/

        // display normal vs muted icon based on audio engine volume
        if (cc.audioEngine.getMusicVolume() == 0)
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(cc.Button).disabledSprite;
        }
        else
        {
            this.node.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(cc.Button).normalSprite;
        }
    }
}
