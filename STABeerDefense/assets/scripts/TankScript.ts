
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tank extends cc.Component 
{

	@property(cc.Sprite)
	tankSprite: cc.Sprite = null;

	@property(cc.AudioSource)
	tankAudioSource: cc.AudioSource = null;

    onDestroy()
	{
		this.node.emit('destroyed', {msg: "throwaway"});
	}

	public DestroyTank()
	{
		this.tankSprite.enabled = false;

		cc.audioEngine.playEffect(this.tankAudioSource.clip, false);

		this.scheduleOnce(function()
		{
			this.node.destroy();
		}, 0.5)
	}
}
