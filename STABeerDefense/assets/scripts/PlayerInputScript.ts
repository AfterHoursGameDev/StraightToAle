/**
 *	Handles player input and pitcher cooldowns.
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerInput extends cc.Component 
{
	// Game State
    gameOver: boolean = false;
	
	// Scene objects
	@property(cc.Node)
    player: cc.Node = null;
	
	@property(cc.Node)
	playerWeapon: cc.Node = null;

    @property(cc.Node)
    playerWeaponNozzle: cc.Node = null;

    @property(cc.Prefab)
    weaponFireFX: cc.Prefab = null;

    @property(cc.Prefab)
    canPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    canPoweredPrefab: cc.Prefab = null;
	
	//@property(cc.Toggle)
	//pitcherToggle: cc.Toggle = null;
	
	pitcherPrefab: cc.Prefab = null;

	@property(cc.AudioClip)
	beerCanLaunch: cc.AudioClip = null;

	// Pitchers
    numCurrentPitchers: number = 0;
	@property
    numMaxPitchers: number = 3;
    activePitcher: boolean = false;
	@property
    beerCooldownTime: number = 0.0;
    @property
    beerCooldownTimeDefault: number = 0.5;
    @property
    beerCooldownTimePowerUp: number = 0.25;
    @property
    pitcherCooldownTime: number = 3;
    @property (cc.AudioSource)
    launcherAudio: cc.AudioSource = null;
    powerUpStateActive: boolean = false;
	
	// PlayerInput
    playerCanThrowBeer: boolean = true;
	playerCanThrowPitcher: boolean = false;
	groundHeight: number = 100;
    newPlayerPosX: number = 0;
    newPos: cc.Vec2 = new cc.Vec2(0,0);
	
	// Weapon rotation
	@property
	rotateToTargetTime: number = 0;
	
	@property
	rotateFromTargetTime: number = 0.75;
	
	targetWeaponRotation: number = 0;
	startingWeaponRotation: number = 0;
	weaponIsRotating: boolean = false;
	weaponIsFiring: boolean = false;
	weaponRotationTimeAccumulation: number = 0;
	totalRotationTimeNeeded: number;
	lastTouchLocation: cc.Vec2 = new cc.Vec2(0,0);
	
	
    
	/**
	 *	Lifecycle callbacks 
	 */
	 
	onLoad()
	{
        // Initialize beer can cooldown timer to default
        this.beerCooldownTime = this.beerCooldownTimeDefault;		
		
		// touch event to grab location when player touches screen
        this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch)=>
        {
            // check to see if game is paused or already rotating to fire
            if (cc.director.isPaused() == false && this.gameOver == false && this.weaponIsFiring == false && (this.playerCanThrowBeer || this.playerCanThrowPitcher) )
            {
                // Only allow throwing upwards.
                if (e.getLocation().y > this.groundHeight)
                {
					this.lastTouchLocation = this.node.convertToNodeSpaceAR(e.getLocation());
					
					this.StartFireWeapon();
                }
            }   
        })
    }
	
	update(dt)
	{
		if (this.weaponIsRotating)
		{
			if (this.weaponRotationTimeAccumulation + dt >= this.totalRotationTimeNeeded)
			{
				this.playerWeapon.rotation = this.targetWeaponRotation;
				this.weaponIsRotating = false;
				if (this.weaponIsFiring)
				{
					this.ActuallyFireWeapon();
				}
			}
			else
			{
				this.playerWeapon.rotation = cc.misc.lerp(this.startingWeaponRotation, this.targetWeaponRotation, this.weaponRotationTimeAccumulation/this.totalRotationTimeNeeded);
				this.weaponRotationTimeAccumulation += dt;
			}
		}
	}
    
    WeaponFireFX()
    {
        var weaponFireFXPrefab = cc.instantiate(this.weaponFireFX);

        weaponFireFXPrefab.setParent(this.player);

        weaponFireFXPrefab.position = this.playerWeaponNozzle.position;
    }
	
	StartFireWeapon()
	{
		this.weaponIsFiring = true;
		
		// First see if we need to flip the player sprite
		// 0 is horizontal center of canvas. -X == left of center.
		// positive scaleX for player == facing left.
		// So if signs of scale and touch X match, flip player.
		if((this.lastTouchLocation.x < this.player.position.x && this.player.scaleX < 0) ||
		   (this.lastTouchLocation.x > this.player.position.x && this.player.scaleX > 0))
		{
			this.player.scaleX *= -1;
		}
		
		// If the player is boss enough to touch dead center 0, it doesn't matter
		// if it's flipped or not, the angle is the same. So save time and don't flip.
		
		// Now start rotating the weapon to the angle for firing.
		// Get the target angle.
		var DestVector = this.lastTouchLocation.sub(this.player.position);
		// We're flipping the sprite so the angle we need is always [0..90] so treat all X values 
		// as positive.
		if (DestVector.x < 0)
		{
			DestVector.x *= -1;
		}
		//atan returns radians because of course it does -_-
		this.targetWeaponRotation = Math.atan(DestVector.y/DestVector.x);
		
		// set the target rotation and time it should take, then start rotation
		this.targetWeaponRotation  = this.targetWeaponRotation * 180 / Math.PI;
		this.totalRotationTimeNeeded = this.rotateToTargetTime;
		this.StartWeaponRotation();
		
		//this.playerWeapon.rotation = this.targetWeaponRotation;
	}
	
	ActuallyFireWeapon()
	{
		var firedWeapon = false;
		// check which thing we're throwing.
		if (this.activePitcher && this.playerCanThrowPitcher)
		{
			firedWeapon = true;
			// throwing a pitcher
			this.playerCanThrowPitcher = false;
			
			this.spawnPitcher(this.lastTouchLocation);
			this.scheduleOnce(function()
			{
				this.playerCanThrowPitcher = true;
			}, this.pitcherCooldownTime);
		}
		else if(this.playerCanThrowBeer)
		{
			firedWeapon = true;
			// throwing a beer can
		
			// Prevent player from throwing another beer can
			this.playerCanThrowBeer = false;
			
			this.spawnBeerCan(this.lastTouchLocation);
			
			this.scheduleOnce(function()
			{
				this.playerCanThrowBeer = true;
			}, this.beerCooldownTime);
		}
		
		if (firedWeapon)
		{
			// set the target rotation and time it should take, then start rotation
			this.totalRotationTimeNeeded = this.rotateFromTargetTime;
			this.targetWeaponRotation = 0;
			this.StartWeaponRotation();
		}
		this.weaponIsFiring = false;
	}
	
	StartWeaponRotation()
	{
		this.startingWeaponRotation = this.playerWeapon.rotation;
		this.weaponRotationTimeAccumulation = 0;
		this.weaponIsRotating = true;
	}
	
	// Instantiate beer can at player location and throw it toward click location
    // Spawning enemy here too for now
    spawnBeerCan(tgtLocation: cc.Vec2)
    {
        // activate weapon firing fx
        this.WeaponFireFX();

        // instantiate beer can prefab
		var can = new cc.Node;
		
		if (this.powerUpStateActive)
		{
			can = cc.instantiate(this.canPoweredPrefab);

			// set the prefab's parent to the primary canvas
			can.setParent(this.node);

			// set the position of the prefab to spawn at weapon nozzle
			can.setPosition(this.player.position.x, this.player.position.y + 50);

			// call script to initialize can movement
			can.getComponent("BeerCanPoweredScript").InitializeBeerCan(tgtLocation);
		}
		else
		{
			can = cc.instantiate(this.canPrefab);

			// set the prefab's parent to the primary canvas
			can.setParent(this.node);

			// set the position of the prefab to spawn at weapon nozzle
			can.setPosition(this.player.position.x, this.player.position.y + 50);

			// call script to initialize can movement
			can.getComponent("BeerCanScript").InitializeBeerCan(tgtLocation);
		}

		//cc.audioEngine.playEffect(this.launcherAudio.clip, false);
		cc.audioEngine.playEffect(this.beerCanLaunch, false);
		
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
			this.playerCanThrowPitcher = true;
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
			this.playerCanThrowPitcher = false;
        }
        else
        {
            // enable pitcher toggle
            this.pitcherToggle.getComponent(cc.Toggle).interactable = true;
        }
    }

    public UpdatePowerUpState(enabled: boolean)
    {
        if (enabled)
        {
            //this.beerCooldownTime = this.beerCooldownTimePowerUp;
            this.powerUpStateActive = true;
            // Add particle effect glow here
        }
        else
        {
            //this.beerCooldownTime = this.beerCooldownTimeDefault;
            this.powerUpStateActive = false
            // Remove particle effect glow here
        }
    }

    public GameOver()
    {
        this.gameOver = true;
    }
}
