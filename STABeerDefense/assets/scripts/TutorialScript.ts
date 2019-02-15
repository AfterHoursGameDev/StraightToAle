
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

    updatedPanelLocation: number = 0;
    playerSwiped: boolean = false;

    onLoad ()
    {
        this.ResetPosition();

        // touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Touch)=>
        {
            if (this.playerSwiped == false)
            {
                if (e.getStartLocation() > e.getLocation())
                {
                    this.playerSwiped = true;

                    this.NextPanelClick();
                }
                else
                {
                    if (e.getStartLocation() < e.getLocation())
                    {
                        this.playerSwiped = true;

                        this.PreviousPanelClick();
                    }
                }
            }
        },this);
    }

    start () {

    }

    update (dt)
    {
        if (this.playerSwiped == true)
        {
            if (Math.round(this.tutorialLayout.node.position.x) == Math.round(this.updatedPanelLocation))
            {
                this.playerSwiped = false;
            }
        }}

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

            this.updatedPanelLocation = this.tutorialLayout.node.position.x - this.tutPanelWidth - this.tutPanelSpacingOffset;

            var moveAction = cc.moveTo(1, new cc.Vec2 (this.updatedPanelLocation, this.tutorialLayout.node.position.y));

            this.tutorialLayout.node.runAction(moveAction);
        }
    }

    public PreviousPanelClick()
    {
        if (this.tutPanelsArrayIndex - 1 >= 0)
        {
            this.tutPanelsArrayIndex -= 1;

            this.updatedPanelLocation = this.tutorialLayout.node.position.x + this.tutPanelWidth + this.tutPanelSpacingOffset;

            var moveAction = cc.moveTo(1, new cc.Vec2 (this.updatedPanelLocation, this.tutorialLayout.node.position.y));

            this.tutorialLayout.node.runAction(moveAction);
        }
    }
}
