
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

    newPlayerPosX: number = 0;
    newPos: cc.Vec2 = new cc.Vec2(0,0);

    deltaTime: number = 0;
    cooldownTime: number = 0.5;

    groundHeight: number = 100;
    horOffset: number = 0;// 375;
    vertOffset: number = 0;// 667;

    playerMoving: boolean = false;
    playerCanThrow: boolean = true;

    // declare array for fermentation tanks
    tanks: Array<cc.Node>;

    @property(cc.Node)
    tank_1: cc.Node = null;

    @property(cc.Node)
    tank_2: cc.Node = null;

    @property(cc.Node)
    tank_3: cc.Node = null;

    @property(cc.Node)
    tank_4: cc.Node = null;


    onLoad () 
    {
        this.node.on('enemySatisfied', (e: cc.Event) =>
        {
            console.log(e.target.name);
        })

        // add all fermentation tanks to an array to randomly select them later
        this.tanks = new Array (this.tank_1, this.tank_2, this.tank_3, this.tank_4);

        // initializing the horizontal and vertical offsets to match screen
        this.horOffset = this.node.width / 2;// 375;
        this.vertOffset = this.node.height / 2;// 667;   

        // touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch)=>
        //this.node.on(cc.Node.EventType.MOUSE_DOWN,(e:cc.Event.EventMouse)=>
        {
            // event will no longer propogate past the first event
            //e.bubbles = false;

            //console.log(e.getCurrentTarget().name);
            //console.log("Click Position: " + e.getLocation().x);

            // if player clicks on the grass below the avatar, then move the avatar to selected point along horizontal axis only
            if (e.getLocation().y <= this.groundHeight)
            {
                //this.movePlayer(e.getLocation());
            }
            // if player clicks anywhere else, throw a beer can
            else
            {
                if (this.playerCanThrow)
                {
                    // Prevent player from throwing another beer can
                    this.playerCanThrow = false;

                    // initiate throwing of the beer can
                    this.throwBeerCan(e.getLocation());

                    // prevent player from throwing another beer until cooldownTime
                    this.scheduleOnce(function()
                    {
                        this.playerCanThrow = true;
                    }, this.cooldownTime);
                }
            }
            
        })
    }

    start ()
    {
        
    }

    update (dt)
    {
        this.deltaTime = dt;

        // this code initially handled player movement
        if (this.playerMoving == true)
        {
            //var player = this.node.getChildByName("hero");

            // If player already occupies X location of click, end movement
            if (this.player.position.x <= (this.newPlayerPosX + this.player.width) && this.player.position.x >= (this.newPlayerPosX- this.player.width))
            {
                this.playerMoving = false;

                // stop the player walk animation
                this.player.getComponent(cc.Animation).stop("walk");
            }
            // If player doesn't occupy X location of click, move to click location
            else
            {
                // If the click location is greater than the player X location, move player to the right
                if(this.newPlayerPosX >= this.player.position.x)
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
        this.newPlayerPosX = mousePos.x - this.horOffset;

        // Prevent player from walking beyond the screen by resetting them to edge of screen
        if (this.newPlayerPosX < -(this.node.width/2) - this.player.width/2)
        {
            this.newPlayerPosX = this.node.width/2 + this.player.width/2;
        }

        // start the player walk animation
        this.player.getComponent(cc.Animation).play("walk");

        // bool to determine whether player should be moving or not
        // much smoother than code below
        this.playerMoving = true;
/*
        // define movement action parameters
        var action = cc.moveTo(1, this.newPlayerPosX, this.player.position.y);
        
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
        /*if(this.newPlayerPosX >= player.position.x)
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
            this.newPos.x = mousePos.x;
        }
        else
        {
            this.newPos.x = mousePos.x - this.horOffset;
        }
/*
        if (mousePos.y <= this.vertOffset)
        {
            //this.newPos.y = mousePos.y + this.vertOffset;
        }
        else
        {
           // this.newPos.y = mousePos.y + this.vertOffset;
        }*/

        this.newPos.y = mousePos.y + this.vertOffset;

        // instantiate beer can prefab
        var canPrefab = cc.instantiate(this.CanPrefab);

        // set the prefab's parent to the primary canvas
        canPrefab.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        canPrefab.setPosition(this.player.position.x, this.player.position.y + this.player.height);

        // define movement action parameters
        //var action = cc.jumpBy(3, this.newPos.x, -(this.node.height), this.newPos.y, 1);
        // TODO: Adjust jump power based on height
        var action = cc.jumpTo(3, this.newPos.x, -(this.node.height), this.newPos.y-450, 1);

        // execute can movement
        canPrefab.runAction(action);

        this.spawnEnemy();
    }

    spawnEnemy()
    {
        var enemyPos = new cc.Vec2;
        var multiplier = 1;

        //this.horOffset = this.horOffset;

        // Randomize negative multiplier so that we get x positions left of the center
        enemyPos.x = Math.random();

        if (enemyPos.x < 0.5)
        {
            multiplier *= -1;
        }

        // Randomize spawn location
        enemyPos.x = Math.random() * this.horOffset * multiplier;
        enemyPos.y = this.node.height;

        // instantiate enemy prefab
        var enemyPrefab = cc.instantiate(this.EnemyPrefab);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        enemyPrefab.setPosition(enemyPos);

        // set the prefab's parent to the primary canvas
        enemyPrefab.setParent(this.node);

        // add all fermentation tanks to an array to randomly select them later
        var fermTank = new Array;
        
        var i;
        for (i = 0; i < this.tanks.length; i++)
        {
            if (this.tanks[i].isValid != false)
            {
                fermTank.push(this.tanks[i])
            }
        }

        // randomly select fermentation tank to attack
        var selectedTank = fermTank[Math.floor(Math.random() * fermTank.length)];

        // call script on enemy to initiate movement
        enemyPrefab.getComponent("EnemyScript").enemyMovement(selectedTank);
    }
}
