import * as React from 'react';
import * as ReactDOM from 'react-dom'
import Playback from './Pages/Playback/Playback'
import { Pages } from './types';
import PageBar from './Components/PageBar/PageBar'
import Home from './Pages/Home/Home'
import Tracks from './Pages/Tracks/Tracks'
import { Provider } from 'react-redux';
import store from './Redux/store'

interface IProps{

}

interface IState{
    page: Pages;
    menuOpen: boolean;
}

class App extends React.Component<{}, IState>{
    constructor(props: any){
        super(props)

        this.state = {
            page: Pages.Playback,
            menuOpen: true
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
                    {/* <div style={{marginRight:'5px', paddingTop: '2px'}} onClick={() => this.setState({menuOpen: !this.state.menuOpen})}>
                        <svg width="42" height="42" fill="currentColor" viewBox="0 0 32 32">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                    </div> */}
                    {this.state.menuOpen ? <PageBar 
                        setPage = {(page) => {
                            this.setState({
                                page: page
                            })
                        }}
                    /> : null}
                </div>

                <div style={{display:'block'}}>
                    {PageToDisplay}
                </div>
            </div>
        )
    }
}

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>
, document.body)
