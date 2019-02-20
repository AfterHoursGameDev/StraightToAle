const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.ProgressBar)
    powerupProgressBar: cc.ProgressBar = null;

    @property(cc.Sprite)
    powerupProgressBarParticle: cc.Sprite = null;

    @property(cc.Sprite)
    multiplierProgressBar: cc.Sprite = null;

    @property(cc.Label)
    multiplierLabel: cc.Label = null;

    onLoad()
	{
        this.UpdateScoreLabel(0);
        this.UpdatePowerUpProgressBar(0);
        this.powerupProgressBarParticle.enabled = false;
        this.UpdateMultiplierProgress(0);
        this.UpdateMultiplierLabel(1);
    }

    public UpdateScoreLabel(value: number)
    {
        if (value >= 0 && value <= 9)
        {
            this.scoreLabel.string = "SCORE: 00000" + value.toString();
        }
        else if (value >= 10 && value <= 99)
        {
            this.scoreLabel.string = "SCORE: 0000" + value.toString();
        }
        else if (value >= 100 && value <= 999)
        {
            this.scoreLabel.string = "SCORE: 000" + value.toString();
        }
        else if (value >= 1000 && value <= 9999)
        {
            this.scoreLabel.string = "SCORE: 00" + value.toString();
        }
        else if (value >= 10000 && value <= 99999)
        {
            this.scoreLabel.string = "SCORE: 0" + value.toString();
        }
        else if (value >= 100000 && value <= 999999)
        {
            this.scoreLabel.string = "SCORE: " + value.toString();
        }
    }

    public UpdatePowerUpProgressBar(value: number)
    {
        var powerUpActive = false;

        this.powerupProgressBar.progress = (value * 2) / 10;

        if (this.powerupProgressBar.progress == 1)
        {
            powerUpActive = true;
            this.powerupProgressBarParticle.enabled = true;
        }
        else
        {
            this.powerupProgressBarParticle.enabled = false;
        }

        return  powerUpActive;
    }

    public UpdateMultiplierProgress(value: number)
    {
        this.multiplierProgressBar.fillRange = (value * 2) / 10;
    }

    public UpdateMultiplierLabel(value: number)
    {
        this.multiplierLabel.string = "x" + value.toString();
    }
}
