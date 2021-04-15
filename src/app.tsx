import { Button, Slider } from '@material-ui/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom'
import * as webCalls from './DiscordFunctions/webCalls'

interface IState{
    volume: number
}

class App extends React.Component<{}, IState>{
    constructor(props: any){
        super(props)

        this.state = {
            volume: 50
        }
    }
    render(){
        return (
            <>
            <div>
                <Button 
                    onClick={() => webCalls.initialize()}
                    style={{backgroundColor: 'blue', marginRight: '10px'}}
                >INITIALIZE</Button>
                <Button 
                    onClick={() => webCalls.playYoutubeLink()}
                    style={{backgroundColor: 'red', marginRight: '10px'}}
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
                        webCalls.setVolume(n / 100)
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
            </div>
            </>
        )
    }
}

webCalls.initialize() //initialize the discord connection

ReactDOM.render(<App />, document.body)
