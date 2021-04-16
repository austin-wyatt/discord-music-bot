import { Button } from '@material-ui/core';
import { Collection } from 'dexie';
import * as React from 'react'
import AddEditTrackModal from '../../Components/TrackModals/AddEditTrackModal'
import * as Database from '../../Dexie/Database'

interface IProps{

}

interface IState{
    currentTrack: Collection | null
    displayTrackModal: boolean
}



class Tracks extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state={
            currentTrack: null,
            displayTrackModal: false
        }
    }

    render(){
        return(
            <>
                {this.state.displayTrackModal ? 
                    <AddEditTrackModal 
                        track={this.state.currentTrack}
                        onClose={() => this.setState({displayTrackModal: false})}
                    /> 
                : null}

                <Button 
                    onClick={() => {
                        Database.addTrack('v3nLH9vF6Hg', "Test Item 2", 0, Database.MediaType.YoutubeLink, (item) => {
                            console.log('ADDED ITEM')
                            console.log(item)
                        })
                    }}
                >
                    Add Sample Track
                </Button>
                <Button 
                    onClick={() => {
                        Database.getAllTracks((items) => {
                            console.log(items)
                        })
                    }}
                >
                    Get Sample Track
                </Button>
                <Button
                    onClick={() => this.setState({displayTrackModal: true})}
                >
                    Open Track Modal
                </Button>
            </>
        )
    }
}

export default Tracks;