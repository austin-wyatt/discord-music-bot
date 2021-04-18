import * as React from 'react'
import { Track } from '../../types';

interface IProps{
    queue: Track[]
    width: string,
    height: string
}

interface IState{

}

class QueueBox extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {

        }
    }

    render(){
        return(
            <div style={{width: this.props.width, height: this.props.height, borderStyle: 'solid', padding: '10px 10px 10px 10px'}}>

            </div>
        )
    }
}

export default QueueBox;