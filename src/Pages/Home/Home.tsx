import { Button } from "@material-ui/core";
import * as React from "react";
import * as webCalls from '../../DiscordFunctions/webCalls'

interface IProps{

}

interface IState{

}

class Home extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {

        }
    }

    render(){
        return (
            <> {/** TODO, add a list of voice channels that the bot is allowed to connect to that can be selected from instead of requiring !jc*/}
            <div> 
                <Button 
                    onClick={() => webCalls.initialize()}
                    style={{backgroundColor: 'lightblue', marginRight: '10px'}}
                >INITIALIZE</Button>
            </div>
            </>
        )
    }
}

export default Home