import * as React from 'react';
import * as ReactDOM from 'react-dom'
import Playback from './Pages/Playback/Playback'
import { MediaType, Pages, RootState, Track } from './types';
import PageBar from './Components/PageBar/PageBar'
import Home from './Pages/Home/Home'
import Tracks from './Pages/Tracks/Tracks'
import { connect, Provider } from 'react-redux';
import store from './Redux/store'
import * as actions from './Redux/actions'
import * as webCalls from './DiscordFunctions/webCalls'

interface IProps{
    currentEntry: Track,
    previousEntry: Track,
    nextEntry: Track,
    loop: boolean,
    setNextEntry: (track: Track) => void,
    setPreviousEntry: (track: Track) => void,
    setCurrentEntry: (track: Track) => void,
    queue: Track[]
}

interface IState{
    page: Pages;
    counter: number;
}


class App extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            page: Pages.Playback,
            counter: 0
        }
    }

    componentDidMount(){
        //@ts-ignore
        window['playNextVideoInQueue'] = () => {
            if(this.props.loop){
                this.playTrack(this.props.currentEntry)
            }
            else{
                this.playTrack(this.props.nextEntry)
            }
        }
    }

    playTrack = (track: Track) => {
        if(!track){
            track = this.props.queue[0]
        }

        if(!this.props.loop){
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
        }

        this.setState({
            counter: this.state.counter + 1
        }, () => console.log(this.state.counter))

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

    render(){
        let PageToDisplay: React.ReactNode = null

        switch(this.state.page){
            case Pages.Home:
                PageToDisplay = <Home />;
                break;
            case Pages.Playback:
                PageToDisplay = <Playback />;
                break;
            case Pages.Tracks:
                PageToDisplay = <Tracks />;
                break;                
        }

        return (
            <div>
                <div style={{display:'block', width: '100vw', height: '10vh'}}>
                    <PageBar 
                        setPage = {(page) => {
                            this.setState({
                                page: page
                            })
                        }}
                    />
                </div>

                <div style={{display:'block'}}>
                    {PageToDisplay}
                </div>
            </div>
        )
    }
}

let ConnectedApp = connect((state: RootState) => ({currentEntry: state.queue.currentEntry, nextEntry: state.queue.nextEntry, previousEntry: state.queue.previousEntry, loop: state.queue.loop, queue: state.queue.queue}), actions)((args: IProps) => <App {...args}/>)

ReactDOM.render(
<Provider store={store}>
    <ConnectedApp />
</Provider>
, document.body)
