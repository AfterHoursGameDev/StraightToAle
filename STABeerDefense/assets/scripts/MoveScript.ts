
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    //@property(cc.Label)
   // label: cc.Label = null;

    @property
    text: string = 'hello';

    @property
    speed:number = 100;

    // onLoad () {}

    start () {

    }

    update (dt)
    {
        this.node.setPosition(this.node.position.x -= this.speed * dt, this.node.position.y);
        
        if (this.node.position.x < -(this.node.getParent().width/2) - this.node.width/2)
        {
            this.node.setPosition(this.node.getParent().width/2 + this.node.width/2, this.node.position.y);
        }
    }
}
