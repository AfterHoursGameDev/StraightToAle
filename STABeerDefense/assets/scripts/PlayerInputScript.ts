/**
 *	Handles player input and pitcher cooldowns.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInput extends cc.Component 
{
	// Scene objects
	@property(cc.Node)
    player: cc.Node = null;

    @property(cc.Prefab)
    canPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    pitcherPrefab: cc.Prefab = null;
	
	@property(cc.Toggle)
    pitcherToggle: cc.Toggle = null;

	// Pitchers
    numCurrentPitchers: number = 0;
	@property
    numMaxPitchers: number = 3;
    activePitcher: boolean = false;
	@property
	beerCooldownTime: number = 0.5;
	@property
    pitcherCooldownTime: number = 3;
    @property (cc.AudioSource)
    launcherAudio: cc.AudioSource = null;
	
	// PlayerInput
    playerCanThrowBeer: boolean = true;
	playerCanThrowPitcher: boolean = true;
	groundHeight: number = 100;
    newPlayerPosX: number = 0;
    newPos: cc.Vec2 = new cc.Vec2(0,0);

    // Game State
    gameOver: boolean = false;
    
	/**
	 *	Lifecycle callbacks 
	 */
	 
	onLoad()
	{
		// touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch)=>
        {
            // check to see if game is paused
            if (cc.director.isPaused() == false && this.gameOver == false)
            {
                // Only allow throwing upwards.
                if (e.getLocation().y > this.groundHeight)
                {
                    // check which thing we're throwing.
                    if (this.activePitcher && this.playerCanThrowPitcher)
                    {
                            // throwing a pitcher
                            this.playerCanThrowPitcher = false;
                            
                            this.spawnPitcher(e.getLocation());
                            this.scheduleOnce(function()
                            {
                                this.playerCanThrowPitcher = true;
                            }, this.pitcherCooldownTime);
                    }
                    else if(this.playerCanThrowBeer)
                    {
                            // throwing a beer can
                        
                            // Prevent player from throwing another beer can
                            this.playerCanThrowBeer = false;
                            
                            this.spawnBeerCan(e.getLocation());
                            
                            this.scheduleOnce(function()
                            {
                                this.playerCanThrowBeer = true;
                            }, this.beerCooldownTime);
                    }
                }
            }   
        })
	}
	
	// Instantiate beer can at player location and throw it toward click location
    // Spawning enemy here too for now
    spawnBeerCan(tgtLocation: cc.Vec2)
    {
        // instantiate beer can prefab
        var can = cc.instantiate(this.canPrefab);

        // set the prefab's parent to the primary canvas
        can.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        can.setPosition(this.player.position.x, this.player.position.y + 50);

        // call script to initialize can movement
        can.getComponent("BeerCanScript").beerCanMovement(tgtLocation, tgtLocation.y);

        cc.audioEngine.playEffect(this.launcherAudio.clip, false);
    }	
	
	// Instantiate beer can at player location and throw it toward click location
    // Spawning enemy here too for now
    spawnPitcher(tgtLocation: cc.Vec2)
    {
        // instantiate beer can prefab
        var pitcher = cc.instantiate(this.pitcherPrefab);

        // set the prefab's parent to the primary canvas
        pitcher.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        pitcher.setPosition(this.player.position.x, this.player.position.y);// + this.player.height);

        // call script to initialize can movement
        pitcher.getComponent("PitcherScript").pitcherMovement(tgtLocation, tgtLocation.y);

        // decrement number of pitchers available
        this.numCurrentPitchers -= 1;

        // update the pitcher toggle text
        this.pitcherToggle.getComponentInChildren(cc.Label).string = this.numCurrentPitchers.toString();

        // update pitcher count and whether button is toggle or not
        this.UpdatePitcherStateValue();

        //this.spawnEnemy();
    }
	
	public EarnPitcher()
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
			this.pitcherToggle.getComponent(cc.Toggle).interactable = true;

			// set the pitcher toggle to checked letting player know they can click
			this.pitcherToggle.getComponent(cc.Toggle).check();
		}
		
		this.pitcherToggle.getComponentInChildren(cc.Label).string = this.numCurrentPitchers.toString();
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
            this.pitcherToggle.getComponent(cc.Toggle).interactable = false;

            // disable player ability to throw pitcher
            this.activePitcher = false;
        }
        else
        {
            // enable pitcher toggle
            this.pitcherToggle.getComponent(cc.Toggle).interactable = true;
        }
    }

    public GameOver()
    {
        this.gameOver = true;
    }
}
