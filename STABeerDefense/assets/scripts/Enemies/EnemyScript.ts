/**
 *	Behavior script for the basic enemy type.
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component 
{

    @property(cc.Prefab)
    enemyDeathFX: cc.Prefab = null;

    @property(cc.AudioSource)
    satisfiedEnemyAudioSource1: cc.AudioSource = null;

    @property(cc.AudioSource)
    satisfiedEnemyAudioSource2: cc.AudioSource = null;

    @property(cc.AudioSource)
    satisfiedEnemyAudioSource3: cc.AudioSource = null;

    satisfiedEnemyAudioSources: Array<cc.AudioSource>;

    horOffset: number = 0;// 375;
    tankHealthModifier: number = 1;
    tankSelected: cc.Node = null;
    destination: cc.Vec2;

    enemyMoveSpeed: number = 10;
    initialized: boolean = false;
	
	@property
	pointValue: number = 5;
	
	movementComponent: cc.Component;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
		this.movementComponent = this.node.getComponent("LineMovementScript");
		if (!this.movementComponent)
		{
			this.movementComponent = this.node.getComponent("ZigZagMovementScript");
			if (!this.movementComponent)
			{
				this.movementComponent = this.node.getComponent("SpiralMovementScript");
			}
		}	
		
		if (!this.movementComponent)
		{
			cc.log('Error! No movement component was found!');
        }

        // array for satisfied enemy sound effects
        this.satisfiedEnemyAudioSources = new Array(this.satisfiedEnemyAudioSource1, this.satisfiedEnemyAudioSource2, this.satisfiedEnemyAudioSource3);
    }

    start ()
    {

    }

    update (dt)
    {
    }
/*
    PlaySoundEffect(soundEffectsArray: Array<cc.AudioSource>)
    {
        var audioSource = soundEffectsArray[Math.floor(Math.random() * soundEffectsArray.length)];

        cc.audioEngine.playEffect(audioSource.clip, false);
    }*/

    onCollisionEnter (other: cc.Collider, self)
    {
        switch (other.node.name)
        {
            case "beerCan":
            {
                // Check for can power up
                other.node.getComponent("BeerCanScript").CheckPowerUpActive();

                // disable collider and have enemy exit screen to right or left
                this.node.getComponent(cc.Collider).enabled = false;
                
                // play audio
                //cc.audioEngine.playEffect(this.node.getComponent(cc.AudioSource).clip, false);
                //cc.audioEngine.playEffect(this.audioSource.clip, false);
                //this.PlaySoundEffect(this.satisfiedEnemyAudioSources);

                // Update the score
                this.node.getParent().getComponent("GameManagerScript").UpdateScore(this.pointValue);

                // Destroy the beer can
                this.DestroyThisNode(true);
                
                break;
            }
            case "fermentation_tank":
            {
                // reduce the "health" of the tank using the fill
                other.node.getComponent(cc.Sprite).fillStart -= this.tankHealthModifier;

                // check to see if tank's health is reduced to 0
                if (other.node.getComponent(cc.Sprite).fillStart <= -1)
                {
                    // if tank is empty, disable collider box
                    // replace sprite with destroyed sprite?
                    other.node.getComponent(cc.BoxCollider).enabled = false;

                    other.node.getComponent("TankScript").DestroyTank();
                    //other.node.destroy();
                }
				// spawn particle effect here
				
                // destroy this enemy
                this.DestroyThisNode(false);

                break;
            }
            case "BeerCanPowerUp":
            {
                // destroy the beer can
                other.node.destroy();

                // disable collider and have enemy exit screen to right or left
                this.node.getComponent(cc.Collider).enabled = false;
                
                // play audio
                //cc.audioEngine.playEffect(this.node.getComponent(cc.AudioSource).clip, false);
                //cc.audioEngine.playEffect(this.audioSource.clip, false);
                //this.PlaySoundEffect(this.satisfiedEnemyAudioSources);

                // Update the score
                this.node.getParent().getComponent("GameManagerScript").UpdateScore(this.pointValue);

                // Destroy the beer can
                this.DestroyThisNode(true);
            }
			case "KillVolume":
			{
				// destroy this enemy, we've exited the screen.
                this.DestroyThisNode(false);
				break;
			}
        }
    }

    public setTargetTank(selectedTank: cc.Node)
    {
        // reference to tank selected as a target so that we can determine when it is destroyed
        this.tankSelected = selectedTank;	
		this.tankSelected.on('destroyed', function(event)
			{
				// if we want to deny the player points for losing this thing's target by making
                // it leave, here's that.
                // TODO: Temporarily removed exitScreen because I'm not sure if they are being destroyed afterward for sake of moving to next wave
                
                //this.movementComponent.exitScreen();
                this.DestroyThisNode();
			}, this
		);
		
		if (this.movementComponent)
		{
			this.movementComponent.setDestination(selectedTank.position);
		}
    }

    DestroyThisNode(satisfiedEnemy: boolean)
    {
        var enemyDeathFXPrefab = cc.instantiate(this.enemyDeathFX);

        enemyDeathFXPrefab.position = this.node.position;

        enemyDeathFXPrefab.setParent(this.node.getParent());

        // Play satisifed enemy clip only if enemy is satisfied
        if (satisfiedEnemy == true)
        {
            // Get random audio clip from array
            var audioSource = this.satisfiedEnemyAudioSources[Math.floor(Math.random() * this.satisfiedEnemyAudioSources.length)];

            // Play audio clip
            enemyDeathFXPrefab.getComponent("EnemyDeathAudioScript").PlaySoundEffect(audioSource.clip);
        }

        this.node.destroy();
    }
}
