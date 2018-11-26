/**
 *	Tracks the current wave (level) and handles spawning enemies.
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component
{
	/**
	 *	object references 
	 */
    @property(cc.Node)
    player: cc.Node = null;
	
	@property(cc.Prefab)
    enemyPrefab: cc.Prefab = null;
	
	@property(cc.Node)
    tank_1: cc.Node = null;

    @property(cc.Node)
    tank_2: cc.Node = null;

    @property(cc.Node)
    tank_3: cc.Node = null;

    @property(cc.Node)
    tank_4: cc.Node = null;

	/**
	 *	Enemy stuff
	 */	
	 
	// for scoring and pitchers
	@property(cc.Label)
    scoreLabel: cc.Label = null;
	
	currentWave: number = 1;
    score: number = 0;
    numSatisfiedEnemiesToPitcher: number = 0;
    numMaxSatisfiedEnemiesToPitcher: number = 5;
	
	
	numEnemiesSpawned: number = 0;
	
	// for spawning
	horizontalCenter: number = 0;// 375;
    verticalCenter: number = 0;// 667;
	
	// declare array for fermentation tanks
    tanks: Array<cc.Node>;
	
	timeSinceLastSpawn: number = 0;
	@property
	minTimeBetweenSpawns: number = 3;
	
	// not ready for this yet.
	// // Chance that an enemy will spawn this tick (starting)
	// @property
	// spawnChance: number = 0;
	
	// // this * current wave + spawn chance = spawn chance per wave.
	// @property
	// spawnMultiplierPerWave = 0.02;
	
	// // chance that the spawned enemy will be an alternate enemy type
	// @property
	// alternateEnemyChancePerLevel: number = 0;
	
	// //chance per level * level = this
	// alternateEnemyChance: number = 0;
    
	
	/**
	 *	Lifecycle callbacks 
	 */
	
    onLoad () 
    {
        // play background music
        cc.audioEngine.playMusic(this.node.getComponent(cc.AudioSource).clip, true);

        this.node.getComponent(cc.AudioSource).volume = 0.1;
		
		cc.log('game manager onLoad');

		// set score to 0
        this.scoreLabel.string = "SCORE: 0000";
		
        // add all fermentation tanks to an array to randomly select them later
        this.tanks = new Array (this.tank_1, this.tank_2, this.tank_3, this.tank_4);

        // initializing the horizontal and vertical centers to match screen
        this.horizontalCenter = this.node.width / 2;// 375;
        this.verticalCenter = this.node.height / 2;// 667;   
		
		
		// Initialize the spawning stuff
		this.alternateEnemyChance = this.alternateEnemyChancePerLevel * this.currentWave;
		
		// start this at 3 seconds, don't make the player wait the full time for the first enemy.
		this.timeSinceLastSpawn = 3; 
    }

    update (dt)
    {
		if (this.timeSinceLastSpawn >= this.minTimeBetweenSpawns)
		{
			this.SpawnEnemy();

			// reset spawn timer
			this.timeSinceLastSpawn = 0;
		}
		else 
		{
			this.timeSinceLastSpawn += dt;
		}
	}

	/**
	 *	Class functions
	 */
	
    SpawnEnemy()
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

            //this.horizontalCenter = this.horizontalCenter;

            // Randomize negative multiplier so that we get x positions left of the center
            enemyPos.x = Math.random();

            if (enemyPos.x < 0.5)
            {
                multiplier *= -1;
            }

            // Randomize spawn location
            enemyPos.x = Math.random() * this.horizontalCenter * multiplier;
            enemyPos.y = this.node.height;
			
			
            // instantiate enemy prefab
            var newEnemy = cc.instantiate(this.enemyPrefab);

            // set the position of the prefab to spawn to the upper right of the player
            // TODO: Update position to reflect throwing direction
            newEnemy.setPosition(enemyPos);

            // set the prefab's parent to the primary canvas
            newEnemy.setParent(this.node);

            // randomly select fermentation tank to attack
            var selectedTank = fermTank[Math.floor(Math.random() * fermTank.length)];

            // call script on enemy to initiate movement
            newEnemy.getComponent("EnemyScript").EnemyMovement(selectedTank);
			
			this.numEnemiesSpawned += 1;
        }

    }

    public UpdateEnemyTarget()
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

            // randomly select fermentation tank to attack
            var selectedTank = fermTank[Math.floor(Math.random() * fermTank.length)];

            return selectedTank;
        }

        return null;
    }

    public UpdateVolume()
    {
		cc.log('update volume');
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

    public UpdateScore(points: number)
    {
        // increment total number of satisfied patrons
        this.score += points;

        // increment total number of satisfied patrons toward a pitcher
        this.numSatisfiedEnemiesToPitcher += 1;
		
		// update the UI score label
        this.UpdateScoreLabel();

        // check to see if player reached number of satisfied patrons required to gain a pitcher
        if(this.numSatisfiedEnemiesToPitcher == this.numMaxSatisfiedEnemiesToPitcher)
        {
			// This function will worry about preventing it from exceeding the max num pitchers.
			this.node.getComponent('PlayerInputScript').EarnPitcher();

            // reset number of satisfied patrons required to gain a pitcher
            this.numSatisfiedEnemiesToPitcher = 0;
        }
    }

    UpdateScoreLabel()
    {
		
        if (this.score >= 0 && this.score <= 9)
        {
            this.scoreLabel.string = "SCORE: 000" + this.score.toString();
        }
        else if (this.score >= 10 && this.score <= 99)
        {
            this.scoreLabel.string = "SCORE: 00" + this.score.toString();
        }
        else if (this.score >= 100 && this.score <= 999)
        {
            this.scoreLabel.string = "SCORE: 0" + this.score.toString();
        }
        else if (this.score >= 1000 && this.score <= 9999)
        {
            this.scoreLabel.string = "SCORE: " + this.score.toString();
        }
    }
}
