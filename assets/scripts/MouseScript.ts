
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component
{
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Prefab)
    CanPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    EnemyPrefab: cc.Prefab = null;

    @property
    playerSpeed: number = 300;

    newPosX: number = 0;
    newPos: cc.Vec2 = new cc.Vec2(0,0);
    deltaTime: number = 0;
    groundHeight: number = 100;
    horOffset: number = 375;
    vertOffset: number = 667;

    playerMoving: boolean = false;

    onLoad () 
    {
        // setup the mouse down click event
        // TODO: update to touch event
        this.node.on(cc.Node.EventType.MOUSE_DOWN,(e:cc.Event.EventMouse)=>
        {
            // event will no longer propogate past the first event
            e.bubbles = false;

            //console.log(e.getCurrentTarget().name);
            console.log("Click Position: " + e.getLocation().x);

            // if player clicks on the grass below the avatar, then move the avatar to selected point along horizontal axis only
            if (e.getLocation().y <= this.groundHeight)
            {
                this.movePlayer(e.getLocation());
            }
            // if player clicks anywhere else, throw a beer can
            else
            {
                this.throwBeerCan(e.getLocation())
            }
            
        })
    }

    start () {

        
    }

    update (dt)
    {
        // this code initially handled player movement
        if (this.playerMoving == true)
        {
            //var player = this.node.getChildByName("hero");

            // If player already occupies X location of click, end movement
            if (this.player.position.x <= (this.newPosX + this.player.width) && this.player.position.x >= (this.newPosX- this.player.width))
            {
                this.playerMoving = false;

                // stop the player walk animation
                this.player.getComponent(cc.Animation).stop("walk");
            }
            // If player doesn't occupy X location of click, move to click location
            else
            {
                // If the click location is greater than the player X location, move player to the right
                if(this.newPosX >= this.player.position.x)
                {
                    this.player.setPosition(this.player.position.x += this.playerSpeed * dt, this.player.position.y);
                }
                // If the click location is less than the player X location, move player to the left
                else
                {
                    this.player.setPosition(this.player.position.x -= this.playerSpeed * dt, this.player.position.y);
                }
            }
        }
    }

    // Move player based on mouse's "x" position
    movePlayer(mousePos: cc.Vec2)
    {
        // store "x" parameter of mouse position
        this.newPosX = mousePos.x - this.horOffset;

        // Prevent player from walking beyond the screen by resetting them to edge of screen
        if (this.newPosX < -(this.node.width/2) - this.player.width/2)
        {
            this.newPosX = this.node.width/2 + this.player.width/2;
        }

        // start the player walk animation
        this.player.getComponent(cc.Animation).play("walk");

        // bool to determine whether player should be moving or not
        // much smoother than code below
        this.playerMoving = true;
/*
        // define movement action parameters
        var action = cc.moveTo(1, this.newPosX, this.player.position.y);
        
        // initiate player movement animation
        this.player.getComponent(cc.Animation).play("walk");

        // execute player movement
        this.player.runAction(action);

        //while (!action.isDone)
       // {}

        // stop player movement animation
        this.player.getComponent(cc.Animation).pause("walk");
*/
        // If the click location is greater than the player X location, face player to the right
        /*if(this.newPosX >= player.position.x)
        {
            
        }
        // If the click location is less than the player X location, face player to the left
        else
        {
            player.setPosition(player.position.x -= 100 * dt, player.position.y);
        }*/
    }

    // Instantiate beer can at player location and throw it toward click location
    // Spawning enemy here too for now
    throwBeerCan(mousePos: cc.Vec2)
    {
        // calculate mouse position offset compared to player location
        // horizontally, canvas units is 0-750 while player units is -375-375
        if (mousePos.x >= this.horOffset)
        {
            this.newPos.x = mousePos.x + this.horOffset;
        }
        else
        {
            this.newPos.x = mousePos.x - this.horOffset;
        }
        
        this.newPos.y = mousePos.y + this.vertOffset;

        // instantiate beer can prefab
        var canPrefab = cc.instantiate(this.CanPrefab);

        // set the prefab's parent to the primary canvas
        canPrefab.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        canPrefab.setPosition(this.player.position.x + this.player.width, this.player.position.y + this.player.height);

        // define movement action parameters
        var action = cc.jumpBy(3, this.newPos.x, -(this.node.height), this.newPos.y, 1);

        // execute can movement
        canPrefab.runAction(action);

        this.spawnEnemy();
    }

    spawnEnemy()
    {
        // instantiate enemy prefab
        var enemyPrefab = cc.instantiate(this.EnemyPrefab);

        // set the prefab's parent to the primary canvas
        enemyPrefab.setParent(this.node);
    }
}
