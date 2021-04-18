import { Button, List, ListItem, makeStyles, Slider, Switch } from "@material-ui/core";
import * as React from "react";
import * as webCalls from '../../DiscordFunctions/webCalls'
import * as actions from '../../Redux/actions'
import { connect } from 'react-redux'
import { MediaType, RootState, Track } from "../../types";
import QueueBox from "../../Components/QueueBox/QueueBox";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";

interface DispatchProps{
    queue: Track[],
    setNextEntry: (track: Track) => void,
    setPreviousEntry: (track: Track) => void,
    setCurrentEntry: (track: Track) => void,
    currentEntry: Track,
    loop: boolean,
    setLoop: (loop: boolean) => void,
    clearQueue: () => void,
    nextEntry: Track,
    previousEntry: Track
}

interface IProps extends DispatchProps{
    classes: ClassNameMap<"queueText">
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

    playTrack = (track: Track) => {
        if(track){
            let previousEntry = null
            let nextEntry = null

            let foundTrack = false
            this.props.queue.some(t => {
                if(foundTrack){
                    nextEntry = t;
                    foundTrack = false
                    return true
                }
                if(t.id == track.id){
                    foundTrack = true
                }
                if(!foundTrack){
                    previousEntry = t
                }
                return false
            })

            this.props.setNextEntry(nextEntry)
            this.props.setPreviousEntry(previousEntry)
            this.props.setCurrentEntry(track)

            switch(track.mediatype){
                case MediaType.LocalResource:
                case MediaType.MediaLink:
                    webCalls.playMedia(track.url)
                    break;
                case MediaType.YoutubeLink:
                    webCalls.playYoutubeLink(track.url)
                    break;
                default:
                    break
            }
        }
    }

    render(){
        return (
            <>
            <div className={this.props.classes.queueText} style={{fontSize:'1.5em'}}>
                Queue
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div>
                    <QueueBox 
                        queue={this.props.queue}
                        width='300px'
                        height='65vh'
                        trackSelected={this.playTrack}
                        currentEntry={this.props.currentEntry}
                    />
                </div>
                <div style={{marginLeft: '25px', width: '450px'}}>
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
                            style={{backgroundColor: 'grey', marginRight: '10px', marginBottom:'5px'}}
                        >PLAY</Button>
                        <Button 
                            onClick={() => webCalls.pause()}
                            style={{backgroundColor: 'grey', marginRight: '10px', marginBottom:'5px'}}
                        >PAUSE</Button>

                        <Button 
                            onClick={() => console.log(this.props)}
                            style={{backgroundColor: 'grey', marginRight: '10px', marginBottom:'5px'}}
                        >PRINT STATE</Button>

                        <Button 
                            onClick={() => this.props.clearQueue()}
                            style={{backgroundColor: 'grey', marginRight: '10px', marginBottom:'5px'}}
                        >CLEAR QUEUE</Button>

                        <Button 
                            onClick={() => this.playTrack(this.props.nextEntry || this.props.queue[0])}
                            style={{backgroundColor: 'grey', marginRight: '10px', marginBottom:'5px'}}
                        >NEXT</Button>
                        <Button 
                            onClick={() => this.playTrack(this.props.previousEntry || this.props.queue[this.props.queue.length - 1])}
                            style={{backgroundColor: 'grey', marginRight: '10px', marginBottom:'5px'}}
                        >PREVIOUS</Button>
                        <div>
                            LOOP
                            <Switch 
                                checked={this.props.loop}
                                onChange={() => this.props.setLoop(!this.props.loop)}
                                style={{marginLeft: '5px'}}
                            />
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default connect((state: RootState) => ({queue: state.queue.queue, currentEntry: state.queue.currentEntry, loop: state.queue.loop, nextEntry: state.queue.nextEntry, previousEntry: state.queue.previousEntry}), actions)((args: any) => {
    const useStyles = makeStyles((theme) => ({
        queueText: {
            ...theme.typography.button,
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(1),
        }
    }));

    const classes = useStyles();
    return(
        <Playback {...args} classes={classes}/>
    )
});