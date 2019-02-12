// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var PlayerInfoScript = require("LeaderboardSetPlayerInfo");

cc.Class({
    extends: cc.Component,

    properties: {
         //playerLabel: {
             // ATTRIBUTES:
         //    default: null,        // The default value will be used only when the component attaching
                                   // to a node for the first time
         //    type: cc.Prefab, // optional, default is typeof default
         //    serializable: true,   // optional, default is true
         //},
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
//this.UpdateLeaberboardInfo();
    },

	// update (dt) {},

    UpdateLeaberboardInfo()
    {
        if ((typeof window.GlobalData !== 'undefined') && (typeof window.GlobalData.Score !== 'undefined'))
		{
			this.ScoreLabel.string = "Score: " + window.GlobalData.Score;
		}
		
		var myName = "---";
		if (typeof FBInstant !== 'undefined') {
			var myName = FBInstant.player.getName();
			FBInstant.getLeaderboardAsync('TopScores')
				  .then(leaderboard => { 
					console.log(leaderboard.getName()); // 'TopScores'
				  }).catch(error => console.error(error));
				  
			// Get top 10 in leaderboard
			FBInstant.getLeaderboardAsync("TopScores")  .then(leaderboard => leaderboard.getEntriesAsync(10, 0)).then(entries => {
				console.log("TOP SCORES (" + entries.length + " entries)")
				var i;
				for (var i = 0; i < entries.length; i++) 
				{
					this.PlayerInfoScript[i].CreatePlayerInfo(entries[i].getPlayer().getPhoto(), entries[i].getPlayer().getName(), entries[i].getScore());
					console.log("#" + entries[i].getRank() + " " + entries[i].getPlayer().getName() + ": " + entries[i].getScore());
					cc.log(entries[i]);
					
				}
				for (;  i<10; i++)
				{
					this.PlayerInfoScript[i].CreatePlayerInfo(null, "", "");
				}
			}).catch(error => console.error(error));
		}
		else
		{
			for (var i = 0; i < 10; i++) 
			{
					this.PlayerInfoScript[i].CreatePlayerInfo(null, "--", "--");
			}
		}
    }
});
