import { Button, Modal, TextField } from '@material-ui/core';
import * as React from 'react';
import { readdirSync } from 'original-fs';
import * as Database from '../../Dexie/Database'
import { Category, MediaType, Track } from '../../types';
import ytpl from 'ytpl';

interface IProps{
    onClose: () => void
    onComplete: () => void
}

interface IState{
    playlistURL: string
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

class ImportFromPlaylist extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
            playlistURL: ''
        }
    }

    getVideosFromPlaylist = () => {
        let url = this.state.playlistURL
        
        let playlist = ytpl(url);

        playlist.then(result => 
        {
            let newCategory: Category = {
                id: 0,
                name: result.title,
                expanded: true
            }

            Database.addCategory(newCategory, (c) => {
                url = url.replace('/', '\\')
                result.items.forEach(item => {
                    let newTrack: Track = {
                        id: 0,
                        displayname: item.title,
                        url: item.id,
                        categoryid: c.id,
                        mediatype: MediaType.YoutubeLink
                    }

                    Database.addTrack(newTrack, () => {});
                })

                this.props.onComplete()
            })

            this.props.onClose();
        }).catch(err => 
        {
            console.error(err)
            this.props.onClose();
        })
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
                        <div style={modalHeaderStyle}>
                            Import Category From Youtube Playlist
                        </div>

                        <div style={{display: 'flex'}}>
                            <div style={{...textStyle, flexDirection:'column'}}>
                                Playlist URL:
                            </div>
                            <TextField 
                                value = {this.state.playlistURL}
                                style = {{...textFieldStyle, flexDirection:'column'}}
                                onChange = {(event) => {
                                    
                                    this.setState({
                                        playlistURL: event.target.value
                                    })
                                }}
                            />
                        </div>

                        <Button 
                            style={buttonStyle} 
                            onClick={() => {
                                this.getVideosFromPlaylist()
                            }
                        }>
                            Import
                        </Button>
                        <Button style={buttonStyle} onClick={this.props.onClose}>Cancel</Button>
                    </div>
                </Modal>
            </>
        )
    }
}

export default ImportFromPlaylist