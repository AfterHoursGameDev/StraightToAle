
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tank extends cc.Component 
{

	@property(cc.Sprite)
	tankSprite: cc.Sprite = null;

	@property(cc.Prefab)
	tankDestroyed: cc.Prefab = null;

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

		var tankDestroyedPrefab = cc.instantiate(this.tankDestroyed);

		tankDestroyedPrefab.setParent(this.node.getParent());

		tankDestroyedPrefab.position = this.node.position;

		tankDestroyedPrefab.rotation = this.node.rotation;

		this.node.destroy();
	}
}
