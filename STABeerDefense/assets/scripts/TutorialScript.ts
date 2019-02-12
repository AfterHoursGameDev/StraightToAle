
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property (cc.Layout)
    tutorialLayout: cc.Layout = null;

    tutPanelsArrayIndex: number = 0;
    tutPanelHomePos: number = 1800;
    tutPanelSpacingOffset: number = 50;
    tutPanelWidth: number = 700;

    onLoad ()
    {
        this.ResetPosition();
    }

    start () {

    }

    // update (dt) {}

    public ResetPosition()
    {
        this.tutorialLayout.node.position.set(new cc.Vec2 (this.tutPanelHomePos, this.tutorialLayout.node.position.y));

        //this.tutPanelsArrayIndex = 0;
    }

    public NextPanelClick()
    {
        if (this.tutPanelsArrayIndex + 1 < 5)
        {
            this.tutPanelsArrayIndex += 1;

            var moveAction = cc.moveTo(1, new cc.Vec2 (this.tutorialLayout.node.position.x - this.tutPanelWidth - this.tutPanelSpacingOffset, this.tutorialLayout.node.position.y));

            this.tutorialLayout.node.runAction(moveAction);
        }
    }

    public PreviousPanelClick()
    {
        if (this.tutPanelsArrayIndex - 1 >= 0)
        {
            this.tutPanelsArrayIndex -= 1;

            var moveAction = cc.moveTo(1, new cc.Vec2 (this.tutorialLayout.node.position.x + this.tutPanelWidth + this.tutPanelSpacingOffset, this.tutorialLayout.node.position.y));

            this.tutorialLayout.node.runAction(moveAction);
        }
    }
}
