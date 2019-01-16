
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad()
    {
        this.scheduleOnce(function()
        {
            this.node.destroy();
        }, 2);
    }

    PlaySoundEffect(audioClip: cc.AudioClip)
    {
        cc.audioEngine.playEffect(audioClip, false);

        console.log(audioClip.name);
    }

}
