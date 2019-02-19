
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioSource)
    satisfiedEnemyAudioSource1: cc.AudioSource = null;

    @property(cc.AudioSource)
    satisfiedEnemyAudioSource2: cc.AudioSource = null;

    @property(cc.AudioSource)
    satisfiedEnemyAudioSource3: cc.AudioSource = null;

    satisfiedEnemyAudioSources: Array<cc.AudioSource>;

    onLoad()
    {
        // Destroy death prefab after a few seconds
        this.scheduleOnce(function()
        {
            this.node.destroy();
        }, 3);

        // array for satisfied enemy sound effects
        this.satisfiedEnemyAudioSources = new Array(this.satisfiedEnemyAudioSource1, this.satisfiedEnemyAudioSource2, this.satisfiedEnemyAudioSource3);
    }

    PlaySoundEffect(enemy: string)
    {
        var audioSource = new cc.AudioSource();

        switch (enemy)
        {
            case "line_enemy":
            {
                audioSource = this.satisfiedEnemyAudioSource1;
                break;
            }
            case "zigzag_enemy":
            {
                audioSource = this.satisfiedEnemyAudioSource2;
                break;
            }
            case "spiral_enemy":
            {
                audioSource = this.satisfiedEnemyAudioSource3;
                break;
            }
        }
        
        if (audioSource != null)
        {
            cc.audioEngine.playEffect(audioSource.clip, false);
        }

        // Get random audio clip from array
        //var audioSource = this.satisfiedEnemyAudioSources[Math.floor(Math.random() * this.satisfiedEnemyAudioSources.length)];
    }

}
