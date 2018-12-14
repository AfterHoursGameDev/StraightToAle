/**
 *	Tracks the current wave (level) and handles spawning enemies.
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component
{
    @property(cc.Label)
    waveNumberLabel: cc.Label = null;

    @property(cc.Node)
    gameOverNode: cc.Node = null;

	/**
	 *	object references 
	 */
    @property(cc.Node)
    player: cc.Node = null;
	
	@property(cc.Prefab)
    lineEnemyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    zigzabEnemyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    spiralEnemyPrefab: cc.Prefab = null;
	
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
	
    score: number = 0;
    numSatisfiedEnemiesToPitcher: number = 0;
    numMaxSatisfiedEnemiesToPitcher: number = 5;
	
	
    numEnemiesSpawned: number = 0;

    // declare array to track number of current enemies
    numCurrentEnemies: Array<cc.Node> = new Array;
	
	// for spawning
	horizontalCenter: number = 0;// 375;
    verticalCenter: number = 0;// 667;
    spawnHeight: number = 0;
    enemySpeed: number = 5;
    inbetweenWaves: boolean = true;
	
	// declare array for fermentation tanks
    tanks: Array<cc.Node>;
    numRemainingTanks: number = 4;
	
	timeSinceLastSpawn: number = 0;
	@property
    minTimeBetweenSpawns: number = 3;
    
    /**
	 *	Wave Stuff
	 */
    currentWaveNumber: number = 1;
    enemyTypesPrefabs: Array<cc.Prefab>;
    enemyTypesThisWave: Array<cc.Prefab>;
    tempLineEnemyPercentChance: number = 1;
    tempZigZagEnemyPercentChance: number = 0;
    tempSpiralEnemyPercentChance: number = 0;

    timeCurrentWave: number = 0;
    timeWaveDuration: number = 20;
    timeWaveDurationIncrement: number = 5;

    updatingWaveParameters: boolean = false;
    gameStarted: boolean = false;
    gameover: boolean = false;
    	
	// not ready for this yet.
	// // Chance that an enemy will spawn this tick (starting)
	// @property
	// spawnChance: number = 0;
	
	// // this * current wave + spawn chance = spawn chance per wave.
	// @property
	// spawnMultiplierPerWave = 0.02;
	
	// chance that the spawned enemy will be an alternate enemy type
	@property
	alternateEnemyChancePerLevel: number = 0;
	
	//chance per level * level = this
	alternateEnemyChance: number = 0;
    
	
	/**
	 *	Lifecycle callbacks 
	 */
	
    onLoad () 
    {
        if (cc.director.isPaused())
        {
            cc.director.resume();
        }

        // start the background music
        this.BackgroundMusic();

		// set score to 0
        this.scoreLabel.string = "SCORE: 0000";
		
        this.InitializeTanks();

        // add all enemy types to an array to randomly select them later
        this.enemyTypesPrefabs = new Array (this.lineEnemyPrefab, this.zigzabEnemyPrefab, this.spiralEnemyPrefab);

        // initializing the horizontal and vertical centers to match screen
        this.horizontalCenter = this.node.width / 2;// 375;
        this.verticalCenter = this.node.height / 2;// 667;   
		this.spawnHeight = this.node.height * 0.6;
		
		
		// Initialize the spawning stuff
		this.alternateEnemyChance = this.alternateEnemyChancePerLevel * this.currentWaveNumber;
		
		// start this at 3 seconds, don't make the player wait the full time for the first enemy.
        this.timeSinceLastSpawn = 3;

        this.UpdateEnemyTypePercentChance();

        this.scheduleOnce(function()
        {
            // delay start of game by 2 seconds
            this.GameStartDelay();
        }, 2);
    }

    update (dt)
    {
        if (this.numRemainingTanks > 0)
        {
            if (this.inbetweenWaves == false)
            {
                // Check to see if wave time limit has passed
                if (this.timeCurrentWave >= this.timeWaveDuration)
                {
                    // reset wave timer
                    this.timeCurrentWave = 0;

                    // pause spawning of enemies
                    this.inbetweenWaves = true;

                    // indicate updating of wave parameters
                    this.updatingWaveParameters = true;
                }
                else if (this.timeSinceLastSpawn >= this.minTimeBetweenSpawns)
                {
                    this.SpawnEnemy();

                    // reset spawn timer
                    this.timeSinceLastSpawn = 0;
                }
                else
                {
                    this.timeSinceLastSpawn += dt;
                    this.timeCurrentWave += dt;
                }
            }
            else
            {
                // check to see if all enemies are gone
                if (this.GetNumberOfRemainingEnemies() == 0 && this.gameStarted == true)
                {
                    if (this.updatingWaveParameters == true)
                    {
                        this.updatingWaveParameters = false;

                        // Update the next wave's parameters
                        this.UpdateWaveParameters();
                    }
                }
            }
        }
        else
        {
            if (this.gameover == false)
            {
                // NO TANKS = GAME OVER
                this.gameover = true;

                this.GameOver();
            }
        }
	}

	/**
	 *	Class functions
	 */
    BackgroundMusic()
    {
        // play background music
        cc.audioEngine.playMusic(this.node.getComponent(cc.AudioSource).clip, true);

        // adjust background music volume
        //this.node.getComponent(cc.AudioSource).volume = 1;
    }

    GameStartDelay()
    {
        // update the wave label
        this.UpdateWaveLabel();

        // delay spawning of enemies
        this.scheduleOnce(function()
        {

        // start spawning of enemies
        this.inbetweenWaves = false;

        // indicate that the game has started
        this.gameStarted = true;
        }, 5);
    }

    InitializeTanks()
    {
        // add all fermentation tanks to an array to randomly select them later
        this.tanks = new Array (this.tank_1, this.tank_2, this.tank_3, this.tank_4);

        for (var i = 0; i < this.tanks.length; i++)
        {
            this.tanks[i].on('destroyed', function(event)
                {
                    // for some reason, we're counting one more than we should have
                    this.numOfRemainingTanks = this.GetRemainingTanks().length - 1;

                    if (this.numOfRemainingTanks == 1)
                    {
                        // display catch phrase
                        this.player.getComponent("CatchPhraseScript").DisplayCustomCatchPhrase("Down to one tank already?");
                    }
                    else
                    {
                        // display catch phrase
                        this.player.getComponent("CatchPhraseScript").DisplayDecanterCatchPhrase();
                    }
                }, this
            );
        }

        // initialize number of tanks
        this.numRemainingTanks = this.tanks.length;
    }

    SpawnEnemy()
    {
        // add all fermentation tanks to an array to randomly select them later
        var remainingTanks = this.GetRemainingTanks();

        if (remainingTanks.length-1 > 0)
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
            enemyPos.y = this.spawnHeight;
			
			
            // instantiate enemy prefab
            var newEnemy = cc.instantiate(this.enemyTypesThisWave[Math.floor(Math.random() * this.enemyTypesThisWave.length)]);

            // set the position of the prefab to spawn to the upper right of the player
            // TODO: Update position to reflect throwing direction
            newEnemy.setPosition(enemyPos);

            // set the prefab's parent to the primary canvas
            newEnemy.setParent(this.node);

            

            // randomly select fermentation tank to attack
            var selectedTank = remainingTanks[Math.floor(Math.random() * remainingTanks.length)];

            // Give enemy information to initialize itself.
            newEnemy.getComponent("EnemyScript").setTargetTank(selectedTank);
			
            this.numEnemiesSpawned += 1;
            this.numCurrentEnemies.push(newEnemy);
        }
    }

    GetRemainingTanks()
    {
        var fermTanks = new Array;

        for (var i = 0; i < this.tanks.length; i++)
        {
            if (this.tanks[i].isValid != false)
            {
                fermTanks.push(this.tanks[i])
            }
        }

        return fermTanks;
    }

    UpdateWaveParameters()
    {
        this.currentWaveNumber += 1;

        // update the on-screen wave label
        this.UpdateWaveLabel();

        this.enemySpeed += this.enemySpeed * 0.2;
        this.minTimeBetweenSpawns -= this.minTimeBetweenSpawns * 0.2;

        //this.tempLineEnemyPercentChance -= 0.2; //this.tempLineEnemyPercentChance;// * 0.1;
        if (this.tempZigZagEnemyPercentChance <= 1 && this.currentWaveNumber > 1)
        {
            this.tempZigZagEnemyPercentChance += 0.2; //this.tempZigZagEnemyPercentChance;// * 0.1;
        }
        
        if (this.tempSpiralEnemyPercentChance <= 1 && this.currentWaveNumber > 2)
        {
            this.tempSpiralEnemyPercentChance += 0.4; //this.tempSpiralEnemyPercentChance;// * 0.1;
        }

        this.UpdateEnemyTypePercentChance();

        this.timeWaveDuration += this.timeWaveDurationIncrement;

        this.scheduleOnce(function()
        {
            // resume spawning of enemies
            this.inbetweenWaves = false;
        },3);

    }

    UpdateWaveLabel()
    {
        if (this.currentWaveNumber == 1)
        {
            // display catch phrase
            this.player.getComponent("CatchPhraseScript").DisplayFirstWaveCatchPhrase();
        }
        else
        {
            // display catch phrase
            this.player.getComponent("CatchPhraseScript").DisplayNewWaveCatchPhrase();
        }

        this.waveNumberLabel.getComponent("WaveLabelScript").UpdateWaveLabel(this.currentWaveNumber);
    }

    UpdateEnemyTypePercentChance()
    {
        this.enemyTypesThisWave = new Array;

        for (var i = 0; i < this.tempLineEnemyPercentChance; i+=0.1)
        {
            this.enemyTypesThisWave.push(this.enemyTypesPrefabs[0]);
        }
        for (var i = 0; i < this.tempZigZagEnemyPercentChance; i+=0.1)
        {
            this.enemyTypesThisWave.push(this.enemyTypesPrefabs[1]);
        }
        for (var i = 0; i < this.tempSpiralEnemyPercentChance; i+=0.1)
        {
            this.enemyTypesThisWave.push(this.enemyTypesPrefabs[2]);
        }
    }

    public UpdateEnemyTarget()
    {
        // add all fermentation tanks to an array to randomly select them later
        var numRemainingTanks = this.GetRemainingTanks();

        if (numRemainingTanks.length > 0)
        {
            var enemyPos = new cc.Vec2;

            // randomly select fermentation tank to attack
            var selectedTank = numRemainingTanks[Math.floor(Math.random() * numRemainingTanks.length)];

            return selectedTank;
        }

        return null;
    }

    public GetNumberOfRemainingEnemies()
    {
        var numEnemies = new Array;

        for (var i = 0; i < this.numCurrentEnemies.length; i++)
        {
            if (this.numCurrentEnemies[i].isValid != false)
            {
                numEnemies.push(this.numCurrentEnemies[i])
            }
        }

        this.numCurrentEnemies = numEnemies;

        return this.numCurrentEnemies.length;
    }

    public UpdateScore(points: number)
    {
        // increment total number of satisfied patrons
        this.score += points;

        // increment total number of satisfied patrons toward a pitcher
        this.numSatisfiedEnemiesToPitcher += 1;
		
		// update the UI score label
        this.UpdateScoreLabel();

        // display catch phrase
        this.player.getComponent("CatchPhraseScript").DisplaySatisfiedCatchPhrase();

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

    GameOver()
    {
        cc.audioEngine.stopMusic();

        this.getComponent("PlayerInputScript").GameOver();

        this.gameOverNode.active = true;

        this.gameOverNode.getComponent("GameOverScript").ShowGameOverScreen();
    }
}
