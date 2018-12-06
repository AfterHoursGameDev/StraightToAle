const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad ()
    {
        this.node.active = false;
    }

    start ()
    {
        
    }

    // update (dt) {}

    public UpdateWaveLabel(waveNumber: number)
    {
        this.node.active = true;

        this.node.getComponent(cc.Label).string = "WAVE " + waveNumber.toString();

        var labelFadeIn = cc.fadeIn(2);
        var labelFadeOut = cc.fadeOut(2);
        var labelFadeDelay = cc.delayTime(5);

        //this.waveNumberLabel.node.runAction(cc.sequence(labelFadeIn, labelFadeDelay, labelFadeOut));

        //this.waveNumberLabel.node.runAction(labelFadeDelay);

        this.scheduleOnce(function() {
            // set inactive after a few seconds
            this.node.active = false;
            
        }, 5);
    }

    DisableNode()
    {
        this.node.active = false;
    }
}
