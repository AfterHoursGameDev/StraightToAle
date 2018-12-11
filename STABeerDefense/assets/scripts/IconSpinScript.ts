
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    rotSpeed: number = 0.05;
    // onLoad () {}

    start () {

    }

    update (dt)
    {
        this.node.rotation = (this.node.rotation += this.rotSpeed);
    }
}
