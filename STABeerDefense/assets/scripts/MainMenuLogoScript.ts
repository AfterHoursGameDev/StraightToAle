
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property (cc.Animation)
    anim: cc.Animation = null;

    animIsPlaying: boolean = true;

    onLoad()
	{
		// touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch)=>
        {
            this.SwitchToMainMenu();  
        })
    }

    start () {

        //this.GoToMainMenu();
        this.anim = this.getComponent(cc.Animation);
        //console.log(this.anim.getAnimationState("AhgdLogo").isPlaying);
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
                    this.node.getParent().active = false;
                }, 2);
                
            }
        }
    }

    SwitchToMainMenu()
    {
        this.node.getParent().active = false;
    }
}
