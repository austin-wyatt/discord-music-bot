import { List, ListItem, ListItemText } from '@material-ui/core';
import * as React from 'react'
import { DefaultTrack, Track } from '../../types';
import { sendInterrupt } from '../../DiscordFunctions/webCalls'

interface IProps{
    queue: Track[]
    width: string,
    height: string,
    trackSelected: (track: Track) => void
    currentEntry: Track | null
}

interface IState{
    selectedTrack: Track
}

class QueueBox extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            selectedTrack: DefaultTrack
        }
    }

    render(){
        return(
            <div style={{width: this.props.width, height: this.props.height, borderStyle: 'solid', padding: '10px 10px 10px 10px', overflowY: 'auto', overflowX: 'hidden'}}>
                <List component="div">
                    {this.props.queue.map(track => (
                        <ListItem
                            onClick={() => {
                                this.props.trackSelected(track)
                                sendInterrupt()
                            }}
                            key={'listitem##' + track.id}
                            dense 
                            button
                            style = {this.props.currentEntry && this.props.currentEntry.id == track.id ? {backgroundColor: 'rgba(0, 0, 0, 0.1)'} : {}}
                        >
                            <ListItemText primary={track.displayname} />
                        </ListItem>
                    ))
                    }
                </List>
            </div>
        )
    }
}

export default QueueBox;