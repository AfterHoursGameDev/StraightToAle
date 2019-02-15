
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    mainMenuCanvas: cc.Node = null;

    @property (cc.Animation)
    anim: cc.Animation = null;

    animIsPlaying: boolean = true;

    onLoad()
	{
		// touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch)=>
        {
            this.SwitchToMainMenu();  
        });
    }

    start ()
    {
        this.anim = this.anim.getComponent(cc.Animation);
    }

    update (dt)
    {
        if (this.animIsPlaying)
        {
            if (this.anim.getAnimationState("AhgdLogo").isPlaying == false)
            {
                this.animIsPlaying = false;

                this.scheduleOnce(function()
                {
                    this.SwitchToMainMenu();
                }, 2);
                
            }
        }
    }

    SwitchToMainMenu()
    {
        this.mainMenuCanvas.active = true;
        this.node.active = false;
    }
}
