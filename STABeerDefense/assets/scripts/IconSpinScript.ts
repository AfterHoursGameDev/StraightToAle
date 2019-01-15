
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    rotSpeed: number = 0.05;

    @property (cc.Boolean)
    clockwiseDirection: boolean = false;
    // onLoad () {}

    start () {

    }

    update (dt)
    {
        if (this.clockwiseDirection == true)
        {
            this.node.rotation = (this.node.rotation += this.rotSpeed);
            
            // avoiding numbers larger than 360
            this.ResetRotation();
        }
        else
        {
            this.node.rotation = (this.node.rotation -= this.rotSpeed);

            // avoiding numbers larger than 360
            this.ResetRotation();
        }
    }

    ResetRotation()
    {
        if(this.node.rotation == 360)
        {
            this.node.rotation = 0;
        }
    }
}
