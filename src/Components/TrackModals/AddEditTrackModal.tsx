import { Collection } from 'dexie';
import * as React from 'react';
import { Modal } from '@material-ui/core'; 

interface IProps{
    track: Collection
    onClose: () => void
}

interface IState{
    currentTrack: Collection
}



class AddEditTrackModal extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
            currentTrack: this.props.track
        }
    }

    render(){
        console.log(this.state.currentTrack)
        return(
            <>
                <Modal
                    open={true}
                    onClose={this.props.onClose}
                >
                    <div>
                        {this.state.currentTrack}
                    </div>
                </Modal>
            </>
        )
    }
}

export default AddEditTrackModal;