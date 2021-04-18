import * as React from 'react';
import { Button, MenuItem, Modal, Select, TextField } from '@material-ui/core'; 
import { Category, mapMediaTypeToString, MediaType, MediaTypesArray, Track } from '../../types';
import * as Database from '../../Dexie/Database'

interface IProps{
    track: Track
    onClose: () => void
}

interface IState{
    currentTrack: Track,
    categories: Category[];
}

const modalHeaderStyle = {height: '60px', width: '490px', backgroundColor: '#212121', color: 'whitesmoke', fontSize: '30px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}
const textStyle = {display:'flex', height: '32px', width: '130px', alignItems: 'center', marginLeft: '10px', fontSize: '20px', marginTop: '25px' }
const textFieldStyle = {width: '320', height: '32px', display: 'flex', fontSize: '20px', marginTop: '25px'}

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


class AddEditTrackModal extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
            currentTrack: {...this.props.track},
            categories: []
        }
    }

    componentDidMount(){
        Database.getAllCategories((categories) => {
            this.setState({
                categories: categories
            })
        })
    }

    render(){
        let addEditText = this.state.currentTrack.id == 0 ? 'Add Track' : 'Edit Track'
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
                            {addEditText}
                        </div>
                        
                        <div style={{display:'flex'}}>
                            <div style={textStyle}>
                                URL:
                            </div>
                            <TextField 
                                value = {this.state.currentTrack.url}
                                style = {textFieldStyle}
                                onChange = {(event) => {
                                    let url = event.target.value
                                    let testString = 'watch?v='

                                    let mediatype = this.state.currentTrack.mediatype
                                    if(url.indexOf(testString) != -1){
                                        url = url.substr(url.indexOf(testString) + testString.length)
                                        mediatype = MediaType.YoutubeLink
                                        if(url.indexOf('&') != -1){
                                            url = url.substr(0, url.indexOf('&'))
                                        }
                                    }
                                    
                                    this.setState({
                                        currentTrack: {...this.state.currentTrack, url: url, mediatype: mediatype}
                                    })
                                }}
                            />
                        </div>

                        <div style={{display:'flex'}}>
                            <div style={textStyle}>
                                Name:
                            </div>
                            <TextField 
                                value = {this.state.currentTrack.displayname}
                                style = {textFieldStyle}
                                inputProps={{ maxLength: 40 }}
                                onChange = {(event) => {
                                    this.setState({
                                        currentTrack: {...this.state.currentTrack, displayname: event.target.value}
                                    })
                                }}
                            />
                        </div>

                        <div style={{display:'flex'}}>
                            <div style={textStyle}>
                                Category:
                            </div>
                            <Select 
                                style = {textFieldStyle}
                                value = {this.state.currentTrack.categoryid}
                                onChange = {(event) => {
                                    this.setState({
                                        currentTrack: {...this.state.currentTrack, categoryid: event.target.value as number || 0}
                                    })
                                }}
                            >
                                {this.state.categories.map(c => {
                                    return <MenuItem value={c.id}>{c.name}</MenuItem>
                                })}
                            </Select>
                        </div>

                        <div style={{display:'flex'}}>
                            <div style={textStyle}>
                                Media Type:
                            </div>
                            <Select 
                                style = {textFieldStyle}
                                value = {this.state.currentTrack.mediatype}
                                onChange = {(event) => {
                                    this.setState({
                                        currentTrack: {...this.state.currentTrack, mediatype: event.target.value as MediaType}
                                    })
                                }}
                            >
                                {MediaTypesArray.map(m => {
                                    return <MenuItem value={m}>{mapMediaTypeToString[m]}</MenuItem>
                                })}
                            </Select>
                        </div>

                        {this.state.currentTrack.id != 0 || this.props.track.displayname != '' ? 
                            <Button style={{...buttonStyle, float: 'left', marginLeft: '10px'}} onClick={() => {
                                Database.deleteTracks([this.state.currentTrack.id], () => {
                                    this.props.onClose()
                                })
                            }}>Delete</Button>
                        : null}

                        <Button style={buttonStyle} onClick={() => {
                            if(this.state.currentTrack.id == 0){
                                let track = this.state.currentTrack
                                if(track.displayname == ''){
                                    track.displayname = '<TEMP>'
                                }
                                Database.addTrack(track, () => {
                                    this.props.onClose()
                                })
                            }
                            else
                                Database.updateTrack(this.state.currentTrack, () => {
                                    this.props.onClose()
                                })
                        }}>{addEditText}</Button>
                        <Button style={buttonStyle} onClick={this.props.onClose}>Cancel</Button>
                    </div>
                </Modal>
            </>
        )
    }
}

export default AddEditTrackModal;