
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    horOffset: number = 375;
    tankHealthValue: number = 0.2;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;

        this.enemyMovement();
    }

    start () {

    }

    // update (dt) {}

    onCollisionEnter (other: cc.Collider, self)
    {
        switch (other.node.name)
        {
            case "beerCan":
            {
                // destroy the beer can
                other.node.destroy();

                // destroy this enemy
                // TODO: disable collider and have enemy exit screen to right or left
                this.node.destroy();
                break;
            }
            case "fermentation_tank":
            {
                // reduce the "health" of the tank using the fill
                other.node.getComponent(cc.Sprite).fillStart -= this.tankHealthValue;

                // check to see if tank's health is reduced to 0
                if (other.node.getComponent(cc.Sprite).fillStart <= -1)
                {
                    // if tank is empty, disable collider box
                    // replace sprite with destroyed sprite?
                    other.node.getComponent(cc.BoxCollider).enabled = false;
                }

                // destroy this enemy
                this.node.destroy();
                break;
            }
        }
    }

    enemyMovement()
    {
        var enemyPos = new cc.Vec2;
        var multiplier = 1;

        // Randomize negative multiplier so that we get x positions left of the center
        enemyPos.x = Math.random();

        if (enemyPos.x < 0.5)
        {
            multiplier *= -1;
        }

        // Randomize spawn location
        enemyPos.x = Math.random() * this.horOffset * multiplier;
        enemyPos.y = this.node.getParent().height + this.node.height;

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        this.node.setPosition(enemyPos);

        // define movement action parameters
        var action = cc.moveTo(10, this.node.position.x, -(this.node.getParent().height));

        // execute can movement
        this.node.runAction(action);
    }
}
