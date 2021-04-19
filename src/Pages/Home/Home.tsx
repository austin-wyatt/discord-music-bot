import { Button, MenuItem, Select } from "@material-ui/core";
import * as React from "react";
import * as webCalls from '../../DiscordFunctions/webCalls'
import * as fs from 'fs';
import { Channel, Guild } from "../../types";

interface IProps{

}

interface IState{
    guilds: Guild[]
    currentGuild: Guild
    currentChannel: Channel
}

class Home extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            guilds: [],
            currentGuild: null,
            currentChannel: null
        }
    }

    componentDidMount(){
        webCalls.getServers((guildData) => {
            let guilds = guildData as Array<Guild>
            this.setState({
                guilds: guilds
            })
        })
    }

//     style = {textFieldStyle}
//     value = {this.state.currentTrack.categoryid}
//     onChange = {(event) => {
//         this.setState({
//             currentTrack: {...this.state.currentTrack, categoryid: event.target.value as number || 0}
//         })
//     }}
// >
//     {this.state.categories.map(c => {
//         return <MenuItem value={c.id}>{c.name}</MenuItem>
//     })}

    render(){
        return (
            <> {/** TODO, add a list of voice channels that the bot is allowed to connect to that can be selected from instead of requiring !jc*/}
            <div> 
                <Button 
                    onClick={() => webCalls.initialize()}
                    style={{backgroundColor: 'lightblue', marginRight: '10px'}}
                >INITIALIZE</Button>

                <div style={{marginTop: '20px'}}>
                    <div style={{minWidth: '100px'}}>
                        Servers
                    </div>
                    <Select
                        value={this.state.currentGuild ? this.state.currentGuild.id : ''}
                        onChange={(event) => {
                            this.setState({
                                currentGuild: this.state.guilds.find(g => g.id == event.target.value)
                            })
                        }}
                        style={{marginLeft: '10px', minWidth: '200px'}}
                    >
                        {this.state.guilds.map(g => {
                            return <MenuItem value={g.id} key={'gui'+g.id}>{g.name}</MenuItem>
                        })}
                    </Select>
                </div>
                <div style={{marginTop: '20px'}}>
                    <div style={{minWidth: '100px'}}>
                        Channels
                    </div>
                    <Select
                        value={this.state.currentChannel ? this.state.currentChannel.id : ''}
                        onChange={(event) => {
                            this.setState({
                                currentChannel: this.state.currentGuild.channels.find(c => c.id == event.target.value)
                            })
                        }}
                        style={{marginLeft: '10px', minWidth: '200px'}}
                    >
                        {this.state.currentGuild ? this.state.currentGuild.channels.map(c => {
                            return <MenuItem value={c.id} key={'ch'+c.id}>{c.name}</MenuItem>
                        }) : ''}
                    </Select>
                </div>
                <Button 
                    onClick={() => webCalls.joinChannel(this.state.currentGuild.id, this.state.currentChannel.id)}
                    style={{backgroundColor: 'lightblue', marginTop: '10px'}}
                >JOIN CHANNEL</Button>
            </div>
            </>
        )
    }
}

export default Home