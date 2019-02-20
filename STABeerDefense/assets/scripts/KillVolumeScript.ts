
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onCollisionEnter (other: cc.Collider, self)
    {
        console.log(other.node.name);
        switch (other.node.name)
        {
            case "beerCan":
            {
                // destroy the beer can
                other.node.getComponent("BeerCanScript").DestroyBeerCan();
               
                break;
            }
            case "beerCanPowered":
            {
                // destroy the beer can
                other.node.getComponent("BeerCanPoweredScript").DestroyBeerCan();

                break;
            }
        }
    }
}
