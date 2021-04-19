import { Button, Modal, TextField } from '@material-ui/core';
import * as React from 'react';
import { readdirSync } from 'original-fs';
import * as Database from '../../Dexie/Database'
import { Category, MediaType, Track } from '../../types';

interface IProps{
    onClose: () => void
    onComplete: () => void
}

interface IState{
    fileURL: string
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

class ImportFromFile extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
            fileURL: ''
        }
    }

    getFilesFromFolder = () => {
        let url = this.state.fileURL
        if(url.indexOf('\\') != -1){
            url = url.replace('\\', '/')
        }
        let files = readdirSync(url)

        let newCategory: Category = {
            id: 0,
            name: url,
            expanded: true
        }
        Database.addCategory(newCategory, (c) => {
            url = url.replace('/', '\\')
            files.forEach(f => {
                if(f.indexOf('.') != -1){
                    let newTrack: Track = {
                        id: 0,
                        displayname: f.substr(0, f.indexOf('.')),
                        url: url + '\\' + f,
                        categoryid: c.id,
                        mediatype: MediaType.LocalResource
                    }

                    Database.addTrack(newTrack, () => {});
                }
                this.props.onComplete()
            })
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
                            Import Category From File
                        </div>

                        <div style={{display: 'flex'}}>
                            <div style={{...textStyle, flexDirection:'column'}}>
                                Folder URL:
                            </div>
                            <TextField 
                                value = {this.state.fileURL}
                                style = {{...textFieldStyle, flexDirection:'column'}}
                                onChange = {(event) => {
                                    
                                    this.setState({
                                        fileURL: event.target.value
                                    })
                                }}
                            />
                        </div>

                        <Button 
                            style={buttonStyle} 
                            onClick={() => {
                                this.getFilesFromFolder()
                            }
                        }>
                            Import from file
                        </Button>
                        <Button style={buttonStyle} onClick={this.props.onClose}>Cancel</Button>
                    </div>
                </Modal>
            </>
        )
    }
}

export default ImportFromFile