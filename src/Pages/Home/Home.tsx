import { Button, MenuItem, Select } from "@material-ui/core";
import * as React from "react";
import * as webCalls from '../../DiscordFunctions/webCalls'
import { Channel, Guild } from "../../types";
import * as Database from '../../Dexie/Database'
import AddServerModal from '../../Components/Modals/AddServerModal'

interface IProps{

}

interface IState{
    guilds: Guild[]
    currentGuild: Guild
    currentChannel: Channel
    displayAddServerModal: boolean
}

class Home extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state = {
            guilds: [],
            currentGuild: null,
            currentChannel: null,
            displayAddServerModal: false
        }
    }

    componentDidMount(){
        this.refreshServers()
    }

    refreshServers = () => {
        Database.getServers((servers) => {
            webCalls.getServersFromIDs(servers.map(s => s.guildid), (guildData) => {
                this.setState({
                    guilds: guildData as Array<Guild>
                })
            })
        })
    }

    render(){
        return (
            <> 
            <div>
                {this.state.displayAddServerModal ? 
                    <AddServerModal
                        onClose={() => {
                            this.refreshServers()
                            this.setState({displayAddServerModal: false})
                        }}
                    /> 
                : null}
                <Button 
                    onClick={() => webCalls.initialize()}
                    style={{backgroundColor: 'lightblue', marginRight: '10px'}}
                >INITIALIZE</Button>
                <Button 
                    onClick={() => this.setState({displayAddServerModal: true})}
                    style={{backgroundColor: 'lightblue', marginRight: '10px'}}
                >ADD NEW SERVER</Button>

                <Button 
                    onClick={() => {
                        if(this.state.currentGuild){
                            Database.getServerByGuildID(this.state.currentGuild.id, (server) => {
                                Database.deleteServers([server.id], () => this.refreshServers())
                            })
                        }
                    }}
                    style={{backgroundColor: 'lightblue', marginRight: '10px'}}
                >DELETE SERVER</Button>

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