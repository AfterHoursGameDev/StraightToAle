
const {ccclass, property} = cc._decorator;

@ccclass
export default class CatchPhrase extends cc.Component {

	@property(cc.Label)
	catchPhraseBox: cc.Label = null;

	catchPhraseDisplayDuration: number = 3;

	catchPhraseSatisfied: Array<string>;
	catchPhraseDecanters: Array<string>;
	catchPhraseRandom: Array<string>;
	catchPhraseNewWave: Array<string>;
	catchPhraseFirstWave: Array<string>;

	preText: string = "<color=#000000>";
	postText: string = "</color>"

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        // set catch phrase box to inactive
        this.catchPhraseBox.node.getParent().active = false;

        // initialize all of the phrases
        this.InitializeCatchPhrases();
    }

    start () {

    }

    // update (dt) {}

    public DisplaySatisfiedCatchPhrase()
    {
        if (Math.random() <= 0.05)
        {
            this.catchPhraseBox.node.getParent().active = true;
            this.catchPhraseBox.string = this.catchPhraseSatisfied[Math.floor(Math.random() * this.catchPhraseSatisfied.length)];

            this.scheduleOnce(function()
            {
                this.catchPhraseBox.node.getParent().active = false;
            }, this.catchPhraseDisplayDuration);
        }
    }

    public DisplayDecanterCatchPhrase()
    {
        if (Math.random() <= 0.05)
        {
            this.catchPhraseBox.node.getParent().active = true;
            this.catchPhraseBox.string = this.catchPhraseDecanters[Math.floor(Math.random() * this.catchPhraseDecanters.length)];

            this.scheduleOnce(function()
            {
                this.catchPhraseBox.node.getParent().active = false;
            }, this.catchPhraseDisplayDuration);
        }
    }

    public DisplayFirstWaveCatchPhrase()
    {
        if (Math.random() <= 0.8)
        {
            this.catchPhraseBox.node.getParent().active = true;
            this.catchPhraseBox.string = this.catchPhraseSatisfied[Math.floor(Math.random() * this.catchPhraseSatisfied.length)];

            this.scheduleOnce(function()
            {
                this.catchPhraseBox.node.getParent().active = false;
            }, this.catchPhraseDisplayDuration);
        }
    }

    public DisplayNewWaveCatchPhrase()
    {
        if (Math.random() <= 0.5)
        {
            this.catchPhraseBox.node.getParent().active = true;
            this.catchPhraseBox.string = this.catchPhraseFirstWave[Math.floor(Math.random() * this.catchPhraseFirstWave.length)];

            this.scheduleOnce(function()
            {
                this.catchPhraseBox.node.getParent().active = false;
            }, this.catchPhraseDisplayDuration);
        }
    }

    public DisplayCustomCatchPhrase(phrase: string)
    {
        this.catchPhraseBox.node.getParent().active = true;
        this.catchPhraseBox.string = phrase;

        this.scheduleOnce(function()
        {
            this.catchPhraseBox.node.getParent().active = false;
        }, this.catchPhraseDisplayDuration);
    }

    InitializeCatchPhrases()
    {
        this.catchPhraseSatisfied = new Array(
            "I got you, bud!",
            "Bottoms up!",
            "Oops, designated driver!",
            "That one's not on the house!"
        );

        this.catchPhraseDecanters = new Array(
            "Down to one decanter!",
            "Hey, I need those!",
            "I have beer for days!",
            "You have to catch them!",
            "Party foul!"
        );

        this.catchPhraseNewWave = new Array(
            "Man, these guys are thirsty!",
            "Hope these guys have ID",
            "You get a beer and you get a beer!",
            "Come on, Happy Hour!"
        );

        this.catchPhraseFirstWave = new Array(
            "We'll need a few drinks for this!",
            "Hope you had a few a drinks.",
            "Hope these guys have ID",
            "Come on, Happy Hour!"
        );
    }
}
