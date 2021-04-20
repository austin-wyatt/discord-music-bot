import { Button, Modal, TextField } from '@material-ui/core';
import * as React from 'react';
import * as Database from '../../Dexie/Database'
import { Guild, Server } from '../../types';
import * as webCalls from '../../DiscordFunctions/webCalls'

interface IProps{
    onClose: () => void
}

interface IState{
    serverID: string,
    displayIncorrectID: boolean
}

const modalHeaderStyle = {height: '60px', width: '490px', backgroundColor: '#212121', color: 'whitesmoke', fontSize: '30px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}
const textStyle: React.CSSProperties = {display:'flex', height: '32px', width: '170px', alignItems: 'center', marginLeft: '10px', fontSize: '20px', marginTop: '25px'}
const textFieldStyle: React.CSSProperties = {width: '280', height: '32px', display: 'flex', fontSize: '20px', marginTop: '25px'}

const buttonStyle: React.CSSProperties = {
    float: 'right',
    border: '1px solid black',
    minWidth: `20%`,
    fontSize: '20px',
    height: '60px',
    maxHeight: '60px',
    borderRadius: '0px',
    marginRight: '10px',
    marginTop: '40px',
    marginBottom: '10px'
}

class AddServerModal extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
            serverID: '',
            displayIncorrectID: false
        }
    }
    render(){
        return(
            <>
                <Modal
                    open={true}
                    onClose={this.props.onClose}
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    disableBackdropClick={true}
                >
                    <div style={{maxHeight: '600px', width: '500px', background: 'whitesmoke'}}>
                        {this.state.displayIncorrectID ? 
                        <Modal
                            open={true}
                            onClose={() => this.setState({displayIncorrectID: false})}
                            style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                            disableBackdropClick={true}
                        >
                            <div style={{maxHeight: '600px', width: '500px', background: 'whitesmoke'}}>
                                <div style={modalHeaderStyle}>
                                    Info
                                </div>

                                <div style={{fontSize: '20px', marginTop: '40px', marginLeft: '10px'}}>
                                    Invalid server ID. 
                                </div>
                                

                                <Button style={buttonStyle} onClick={() => this.setState({displayIncorrectID: false})}>OK</Button>
                            </div>
                        </Modal>
                        : null}
                        <div style={modalHeaderStyle}>
                            Add Server
                        </div>

                        <div style={{display: 'flex'}}>
                            <div style={{...textStyle, flexDirection:'column'}}>
                                Server ID:
                            </div>
                            <TextField 
                                value = {this.state.serverID}
                                style = {{...textFieldStyle, flexDirection:'column'}}
                                onChange = {(event) => {
                                    this.setState({
                                        serverID: event.target.value
                                    })
                                }}
                                type='number'
                            />
                        </div>

                        <Button 
                            style={buttonStyle} 
                            onClick={() => {
                                webCalls.getServersFromIDs([parseInt(this.state.serverID)], (guildData) => {
                                    let guilds = guildData as Array<Guild>

                                    if(guilds.length == 0){
                                        this.setState({
                                            displayIncorrectID: true
                                        })
                                    }
                                    else if(guilds.length > 0){
                                        guilds.forEach(g => {
                                            let server: Server = {
                                                name: g.name,
                                                guildid: g.id,
                                                id: 0
                                            }
                                            Database.addServer(server, () => {
                                                this.props.onClose()
                                            })
                                        })
                                    }
                                })
                            }
                        }>
                            Add Server
                        </Button>
                        <Button style={buttonStyle} onClick={this.props.onClose}>Cancel</Button>
                    </div>
                </Modal>
            </>
        )
    }
}

export default AddServerModal