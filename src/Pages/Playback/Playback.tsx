import { Button, Slider } from "@material-ui/core";
import * as React from "react";
import * as webCalls from '../../DiscordFunctions/webCalls'
import * as actions from '../../Redux/actions'
import { connect } from 'react-redux'
import { RootState, Track } from "../../types";
import QueueBox from "../../Components/QueueBox/QueueBox";

interface DispatchProps{
    queue: Track[]
}

interface IProps extends DispatchProps{

}

interface IState{
    volume: number
}

class Playback extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            volume: 50
        }
    }

    render(){
        return (
            <>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <QueueBox 
                    queue={this.props.queue}
                    width='300px'
                    height='900px'
                />
                <div>
                    <div>
                        <Button 
                            onClick={() => webCalls.playYoutubeLink('czTksCF6X8Y')}
                            style={{backgroundColor: 'green', marginRight: '10px'}}
                        >PLAY YOUTUBE</Button>
                    </div>
                    <div>
                        <Slider 
                            value={this.state.volume} 
                            style={{width:'25%'}}
                            onChange={(e, val) => {
                                let n = val as number
                                this.setState({volume: n})
                            }} 
                            onChangeCommitted={(e, val) => {
                                let n = val as number
                                this.setState({volume: n})
                                webCalls.setVolume(n / 50)
                            }} 
                        />
                    </div>
                    <div>
                        <Button 
                            onClick={() => webCalls.play()}
                            style={{backgroundColor: 'grey', marginRight: '10px'}}
                        >PLAY</Button>
                        <Button 
                            onClick={() => webCalls.pause()}
                            style={{backgroundColor: 'grey', marginRight: '10px'}}
                        >PAUSE</Button>

                        <Button 
                            onClick={() => console.log(this.props.queue)}
                            style={{backgroundColor: 'grey', marginRight: '10px'}}
                        >PRINT STATE</Button>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default connect((state: RootState) => ({queue: state.queue}), actions)(Playback);