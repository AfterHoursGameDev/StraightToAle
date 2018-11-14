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
    numMaxPitchers: number = 3;
    activePitcher: boolean = false;
	beerCooldownTime: number = 0.5;
	
	// PlayerInput
    playerCanThrow: boolean = true;
	groundHeight: number = 100;
    newPlayerPosX: number = 0;
    newPos: cc.Vec2 = new cc.Vec2(0,0);
	
	/**
	 *	Lifecycle callbacks 
	 */
	 
	onLoad()
	{
		cc.log('PlayerInput loaded');
		// touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch)=>
        {
           // Only allow throwing cans up.
           if (e.getLocation().y > this.groundHeight)
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
	
	// Instantiate beer can at player location and throw it toward click location
    // Spawning enemy here too for now
    spawnBeerCan(tgtLocation: cc.Vec2)
    {
		cc.log('spawn beer can');
        // instantiate beer can prefab
        var can = cc.instantiate(this.canPrefab);

        // set the prefab's parent to the primary canvas
        can.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        can.setPosition(this.player.position.x, this.player.position.y + this.player.height);

        // call script to initialize can movement
        can.getComponent("BeerCanScript").beerCanMovement(tgtLocation, tgtLocation.y);

        //this.spawnEnemy();
    }	
	
	// Instantiate beer can at player location and throw it toward click location
    // Spawning enemy here too for now
    spawnPitcher(tgtLocation: cc.Vec2)
    {
		cc.log('spawn pitcher');
        // instantiate beer can prefab
        var pitcher = cc.instantiate(this.pitcherPrefab);

        // set the prefab's parent to the primary canvas
        pitcher.setParent(this.node);

        // set the position of the prefab to spawn to the upper right of the player
        // TODO: Update position to reflect throwing direction
        pitcher.setPosition(this.player.position.x, this.player.position.y + this.player.height);

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
		cc.log('player earn pitcher');
		// check for max number of pitchers player can have
		if(this.numCurrentPitchers < this.numMaxPitchers)
		{
			cc.log('added pitcher');
			// increment number of pitchers
			this.numCurrentPitchers += 1;
		}

		// check if player has more than 0 pitchers
		if (this.numCurrentPitchers > 0)
		{
			cc.log('update pitcher toggleB');
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
		cc.log('spawn pitcher');
        // check to see if all pitchers have been used
        if (this.numCurrentPitchers <= 0)
        {
			cc.log('0 pitchers');
            // disable the pitcher toggle
            this.pitcherToggle.getComponent(cc.Toggle).interactable = false;

            // disable player ability to throw pitcher
            this.activePitcher = false;
        }
        else
        {
			cc.log('enable pitcher toggle');
            // enable pitcher toggle
            this.pitcherToggle.getComponent(cc.Toggle).interactable = true;
        }
    }

}
