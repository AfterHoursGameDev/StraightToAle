
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
    PitcherPrefab: cc.Prefab = null;

    numSatisfiedEnemies: number = 0;
    numSatisfiedEnemiesToPitcher: number = 0;
    numMaxSatisfiedEnemiesToPitcher: number = 5;
    numCurrentPitchers: number = 0;
    numMaxPitchers: number = 3;
    activePitcher: boolean = false;

    @property(cc.Toggle)
    PitcherToggle: cc.Toggle = null;

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

    // offset to spawn enemies coming in toward the side
    enemySpawnOffsetX = 200;

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

    @property(cc.Label)
    scoreLabel: cc.Label;

    onLoad () 
    {
        // play background music
        //cc.audioEngine.playMusic(this.node.getComponent(cc.AudioSource).clip, true);

        //this.node.getComponent(cc.AudioSource).volume = 0.1;

        // set score to 0
        this.scoreLabel.string = "SCORE: 0000";

        // add all fermentation tanks to an array to randomly select them later
        this.tanks = new Array (this.tank_1, this.tank_2, this.tank_3, this.tank_4);

        // initializing the horizontal and vertical offsets to match screen
        this.horOffset = this.node.width / 2;// 375;
        this.vertOffset = this.node.height / 2;// 667;   

        // touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch)=>
        //this.node.on(cc.Node.EventType.MOUSE_DOWN,(e:cc.Event.EventMouse)=>
        {
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

                    // initiate throwing of drink
                    if (this.activePitcher == false)
                    {
                        this.spawnBeerCan(e.getLocation());
                    }
                    else
                    {
                        this.spawnPitcher(e.getLocation());
                    }

                    // prevent player from throwing another beer until cooldownTime
                    this.scheduleOnce(function()
                    {
                        this.playerCanThrow = true;
                    }, this.cooldownTime);
                }
            }
            
        })
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
    movePlayer(tgtLocation: cc.Vec2)
    {
        // store "x" parameter of mouse position
        this.newPlayerPosX = tgtLocation.x - this.horOffset;

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
    spawnBeerCan(tgtLocation: cc.Vec2)
    {
        // instantiate beer can prefab
        var canPrefab = cc.instantiate(this.CanPrefab);

        // set the prefab's parent to the primary canvas
        canPrefab.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        canPrefab.setPosition(this.player.position.x, this.player.position.y + this.player.height);

        // call script to initialize can movement
        canPrefab.getComponent("BeerCanScript").beerCanMovement(tgtLocation, tgtLocation.y);

        this.spawnEnemy();
    }

    // Instantiate beer can at player location and throw it toward click location
    // Spawning enemy here too for now
    spawnPitcher(tgtLocation: cc.Vec2)
    {
        // instantiate beer can prefab
        var canPrefab = cc.instantiate(this.PitcherPrefab);

        // set the prefab's parent to the primary canvas
        canPrefab.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        canPrefab.setPosition(this.player.position.x, this.player.position.y + this.player.height);

        // call script to initialize can movement
        canPrefab.getComponent("PitcherScript").pitcherMovement(tgtLocation, tgtLocation.y);

        // decrement number of pitchers available
        this.numCurrentPitchers -= 1;

        // update the pitcher toggle text
        this.PitcherToggle.getComponentInChildren(cc.Label).string = this.numCurrentPitchers.toString();

        // update pitcher count and whether button is toggle or not
        this.UpdatePitcherStateValue();

        this.spawnEnemy();
    }

    spawnEnemy()
    {
        // add all fermentation tanks to an array to randomly select them later
        var fermTank = new Array;

        var i = 0;

        for (i = 0; i < this.tanks.length; i++)
        {
            if (this.tanks[i].isValid != false)
            {
                fermTank.push(this.tanks[i])
            }
        }

        if (fermTank.length > 0)
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
            enemyPos.x = Math.random() * (this.horOffset + this.enemySpawnOffsetX) * multiplier;
            enemyPos.y = this.node.height;

            // instantiate enemy prefab
            var enemyPrefab = cc.instantiate(this.EnemyPrefab);

            // set the position of the prefab to spawn to the upper right of the player
            // TODO: Update position to reflect throwing direction
            enemyPrefab.setPosition(enemyPos);

            // set the prefab's parent to the primary canvas
            enemyPrefab.setParent(this.node);

            // randomly select fermentation tank to attack
            var selectedTank = fermTank[Math.floor(Math.random() * fermTank.length)];

            // call script on enemy to initiate movement
            enemyPrefab.getComponent("EnemyScript").enemyMovement(selectedTank);
        }

    }

    public UpdateVolume()
    {
        console.log(cc.audioEngine.getMusicVolume());
        if (cc.audioEngine.getMusicVolume() == 1)
        {
            cc.audioEngine.setMusicVolume(0);
        }
        else
        {
            cc.audioEngine.setMusicVolume(1);
        }

        if (cc.audioEngine.getEffectsVolume() == 1)
        {
            cc.audioEngine.setEffectsVolume(0);
        }
        else
        {
            cc.audioEngine.setEffectsVolume(1);
        }
    }

    public UpdatePitcherState(pitcherState: cc.Toggle)
    {
        if (pitcherState.isChecked)
        {
            this.activePitcher = false;
        }
        else
        {
            if(this.numCurrentPitchers > 0)
            {
                this.activePitcher = true;
            }
        }
    }

    // Update the number of pitchers player has
    UpdatePitcherStateValue()
    {
        // check to see if all pitchers have been used
        if (this.numCurrentPitchers <= 0)
        {
            // disable the pitcher toggle
            this.PitcherToggle.getComponent(cc.Toggle).interactable = false;

            // disable player ability to throw pitcher
            this.activePitcher = false;
        }
        else
        {
            // enable pitcher toggle
            this.PitcherToggle.getComponent(cc.Toggle).interactable = true;
        }
    }

    public UpdateScore()
    {
        // increment total number of satisfied patrons
        this.numSatisfiedEnemies += 5;

        // update the UI score label
        this.UpdateScoreLabel();

        // increment total number of satisfied patrons toward a pitcher
        this.numSatisfiedEnemiesToPitcher += 1;

        // check to see if player reached number of satisfied patrons required to gain a pitcher
        if(this.numSatisfiedEnemiesToPitcher == this.numMaxSatisfiedEnemiesToPitcher)
        {
            // check for max number of pitchers player can have
            if(this.numCurrentPitchers < this.numMaxPitchers)
            {
                // increment number of pitchers
                this.numCurrentPitchers += 1;
            }

            // check if player has more than 0 pitchers
            if (this.numCurrentPitchers > 0)
            {
                // enable the pitcher toggle
                this.PitcherToggle.getComponent(cc.Toggle).interactable = true;

                // set the pitcher toggle to checked letting player know they can click
                this.PitcherToggle.getComponent(cc.Toggle).check();
            }

            // reset number of satisfied patrons required to gain a pitcher
            this.numSatisfiedEnemiesToPitcher = 0;

            // update the pitcher toggle text
            this.PitcherToggle.getComponentInChildren(cc.Label).string = this.numCurrentPitchers.toString();
        }
    }

    UpdateScoreLabel()
    {
        if (this.numSatisfiedEnemies >= 0 && this.numSatisfiedEnemies <= 9)
        {
            this.scoreLabel.string = "SCORE: 000" + this.numSatisfiedEnemies.toString();
        }
        else if (this.numSatisfiedEnemies >= 10 && this.numSatisfiedEnemies <= 99)
        {
            this.scoreLabel.string = "SCORE: 00" + this.numSatisfiedEnemies.toString();
        }
        else if (this.numSatisfiedEnemies >= 100 && this.numSatisfiedEnemies <= 999)
        {
            this.scoreLabel.string = "SCORE: 0" + this.numSatisfiedEnemies.toString();
        }
        else if (this.numSatisfiedEnemies >= 1000 && this.numSatisfiedEnemies <= 9999)
        {
            this.scoreLabel.string = "SCORE: " + this.numSatisfiedEnemies.toString();
        }
    }
}
