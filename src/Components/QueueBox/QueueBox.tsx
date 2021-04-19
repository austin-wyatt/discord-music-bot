import { List, ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core';
import * as React from 'react'
import { DefaultTrack, Track } from '../../types';
import { sendInterrupt } from '../../DiscordFunctions/webCalls'

interface IProps{
    queue: Track[]
    width: string,
    height: string,
    trackSelected: (track: Track) => void
    currentEntry: Track | null
    removeTrackFromQueue: (track: Track) => void
    setQueueOrder: (tracks: Track[]) => void
}

interface IState{
    selectedTrack: Track
    mouseX: number,
    mouseY: number,
}

class QueueBox extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            selectedTrack: DefaultTrack,
            mouseX: 0,
            mouseY: 0,
        }
    }

    handleMenuClose = () => {
        this.setState({
            mouseX: 0,
            mouseY: 0
        })
    }

    handleClick = (event: any) => {
        event.preventDefault();
        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    setOrder = (id: number, before: boolean) => {
        if(id != this.state.selectedTrack.id){
            let currentQueue = this.props.queue.filter(t => t.id != this.state.selectedTrack.id) //remove the current track from the queue
            let itemIndex = currentQueue.findIndex(t => t.id == id)

            if(before){
                itemIndex += 1
            }

            if(itemIndex == -1){
                itemIndex = 0
            }
            if(itemIndex >= currentQueue.length){
                itemIndex = currentQueue.length - 1
            }

            currentQueue.splice(itemIndex, 0, this.state.selectedTrack)

            this.props.setQueueOrder(currentQueue)
        }
    }

    render(){
        return(
            <div style={{width: this.props.width, height: this.props.height, borderStyle: 'solid', padding: '10px 10px 10px 10px', overflowY: 'auto', overflowX: 'hidden'}}>
                <List component="div" id="QUEUEBOXLISTID">
                    {this.props.queue.map(track => (
                        <div 
                            draggable
                            onDragStart={(event) => {
                                //@ts-ignore
                                let selectedTrack = this.props.queue.find(t => t.id == +event.target.id);
                                
                                //@ts-ignore
                                event.dataTransfer.setDragImage(event.target, 125, 18)
                                this.setState({
                                    selectedTrack: selectedTrack
                                })
                            }}
                            onDragEnd={(event) => {
                                event.persist()
                                let putBefore = true
                                //@ts-ignore
                                const elementHeight = event.target.offsetHeight;

                                let elements = document.elementsFromPoint(event.pageX, event.pageY).filter(e => e.id)
                                let listItem = elements.filter(e => parseInt(e.id))
                                if(listItem[0]){
                                    //@ts-ignore
                                    let relationToElement = event.pageY - listItem[0].getBoundingClientRect().y
                                    if(relationToElement < elementHeight / 2){
                                        putBefore = false
                                    }

                                    this.setOrder(+listItem[0].id, putBefore)
                                }
                            }}
                            key={'listitemdiv##' + track.id}
                            id={`${track.id}`} //event.target.offsetHeight/2
                        >
                            <ListItem
                                onClick={() => {
                                    this.props.trackSelected(track)
                                    sendInterrupt()
                                }}
                                onContextMenu={(event) => {
                                    this.handleClick(event)
                                    this.setState({
                                        selectedTrack: track
                                    })
                                }}
                                
                                key={'listitem##' + track.id}
                                dense 
                                button
                                style = {this.props.currentEntry && this.props.currentEntry.id == track.id ? {backgroundColor: 'rgba(0, 0, 0, 0.1)'} : {}}
                            >
                                <ListItemText primary={track.displayname} />
                            </ListItem>
                        </div>
                    ))
                    }
                </List>

                <Menu
                    keepMounted
                    open={this.state.mouseY !== 0}
                    onClose={this.handleMenuClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                    this.state.mouseY !== 0 && this.state.mouseX !== 0
                        ? { top: this.state.mouseY, left: this.state.mouseX }
                        : undefined
                    }
                >
                    <MenuItem onClick={() => {
                        this.handleMenuClose()
                        this.props.removeTrackFromQueue(this.state.selectedTrack)
                        }}>Remove from queue</MenuItem>
                    </Menu>
            </div>
        )
    }
}

export default QueueBox;