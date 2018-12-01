
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tank extends cc.Component 
{

 
    onDestroy()
	{
		this.node.emit('destroyed', {msg: "throwaway"});
	}
}
