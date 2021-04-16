import * as React from "react";
import { Button } from '@material-ui/core'
import { Pages } from "../../types"

interface IProps{
    setPage: (page: Pages) => void
}

interface IState{
}

const PagesCount = Object.keys(Pages).length

const buttonStyle: React.CSSProperties = {
    float: 'left',
    border: '1px solid black',
    width: `${100/PagesCount}%`,
    fontSize: '1em',
    height: '50%',
    borderRadius: '0px'
}

class PageBar extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
        }
    }

    render(){
        return(
            <>
            <Button 
                style={buttonStyle}
                className='ButtonBar'
                onClick={() => this.props.setPage(Pages.Home)}
            > 
                HOME
            </Button>
            <Button 
                style={buttonStyle}
                className='ButtonBar'
                onClick={() => this.props.setPage(Pages.Playback)}
            > 
                PLAYBACK
            </Button>
            <Button 
                style={buttonStyle}
                className='ButtonBar'
                onClick={() => this.props.setPage(Pages.Tracks)}
            > 
                TRACKS
            </Button>
            </>
        )
    }
}

export default PageBar;