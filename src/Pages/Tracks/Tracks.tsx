import { Button, Collapse, Grid, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Modal, Select, Switch, TextField } from '@material-ui/core';
import * as React from 'react'
import AddEditTrackModal from '../../Components/Modals/AddEditTrackModal'
import * as Database from '../../Dexie/Database'
import { Track, DefaultTrack, Category, DefaultCategory } from '../../types';
import AddEditCategoryModal from '../../Components/Modals/AddEditCategoryModal'
import * as actions from '../../Redux/actions'
import { connect } from 'react-redux'
import ImportFromFile from '../../Components/Modals/ImportFromFile';

interface DispatchProps{
    addTrackToQueue: (track: Track) => void
}

interface IProps extends DispatchProps{

}

interface IState{
    currentTrack: Track
    currentCategory: Category
    displayTrackModal: boolean
    displayCategoryModal: boolean
    categories: Category[]
    tracks: Track[]
    expandedCategories: boolean[];
    mouseX: number,
    mouseY: number,
    deleteMode: boolean,
    searchValue: string,
    searchType: SearchType,
    searchData: {
        Categories: SearchData,
        Tracks: SearchData
    },
    displayImportModal: boolean
    displayDeleteModal: boolean
}

enum SearchType{
    Categories,
    Tracks
}

interface SearchData{
    [key: number]: boolean
}

const SearchTypeStrings = ['Categories', 'Tracks']

const modalHeaderStyle = {height: '60px', width: '490px', backgroundColor: '#212121', color: 'whitesmoke', fontSize: '30px', display: 'flex', alignItems: 'center', paddingLeft: '10px'}
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


class Tracks extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props)

        this.state={
            currentTrack: DefaultTrack,
            currentCategory: DefaultCategory,
            displayTrackModal: false,
            displayCategoryModal: false,
            categories: [],
            tracks: [],
            expandedCategories: [],
            mouseX: 0,
            mouseY: 0,
            deleteMode: false,
            searchValue: '',
            searchType: SearchType.Categories,
            searchData: {Categories:{}, Tracks: {}},
            displayImportModal: false,
            displayDeleteModal: false
        }
    }

    componentDidMount(){
        this.refreshCategories(true)

        this.refreshTracks(true)
    }

    refreshCategories(refreshSearchData?: boolean, fnCallback?: () => void){
        let categorySearchData: SearchData = {}

        Database.getAllCategories((items) => {
            if(refreshSearchData){
                items.forEach((i) => {
                    categorySearchData[i.id] = true
                })
                this.setState({
                    searchData: {...this.state.searchData, Categories: categorySearchData}
                })
            }

            this.setState({
                categories: items
            }, fnCallback)
        })
    }

    refreshTracks(refreshSearchData?: boolean, fnCallback?: () => void){
        let trackSearchData: SearchData = {}

        Database.getAllTracks((items) => {
            if(refreshSearchData){
                items.forEach((i) => {
                    trackSearchData[i.id] = true
                })
                this.setState({
                    searchData: {...this.state.searchData, Tracks: trackSearchData}
                })
            }

            this.setState({
                tracks: items
            }, fnCallback)
        })
    }

    handleClick = (event: any) => {
        event.preventDefault();
        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    handleMenuClose = () => {
        this.setState({
            mouseX: 0,
            mouseY: 0
        })
    }

    handleSearch = () => {
        let trackSearchData: SearchData = {}
        let categorySearchData: SearchData = {}

        this.state.categories.forEach((c) => {
            if(this.state.searchType == SearchType.Tracks){
                categorySearchData[c.id] = false
            }
            else{
                if(c.name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1){
                    categorySearchData[c.id] = true
                }
                else{
                    categorySearchData[c.id] = false
                }
            }
        })

        this.state.tracks.forEach((t) => {
            if(this.state.searchType == SearchType.Categories){
                if(categorySearchData[t.categoryid] == false){
                    trackSearchData[t.id] = false
                }
                else{
                    trackSearchData[t.id] = true
                }
            }
            else{
                if(t.displayname.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1){
                    trackSearchData[t.id] = true
                    categorySearchData[t.categoryid] = true
                }
                else{
                    trackSearchData[t.id] = false
                }
            }
        })

        this.setState({
            searchData: {
                Categories: categorySearchData,
                Tracks: trackSearchData
            }
        })
    }

    render(){ //TODO, add file mass import
        return(
            <>
                {this.state.displayTrackModal ? 
                    <AddEditTrackModal 
                        track={this.state.currentTrack}
                        onClose={() => this.setState({displayTrackModal: false}, () => {this.refreshTracks(undefined, this.handleSearch)})}
                    /> 
                : null}
                {this.state.displayCategoryModal ? 
                    <AddEditCategoryModal 
                        category={this.state.currentCategory}
                        onClose={() => this.setState({displayCategoryModal: false}, () => {this.refreshCategories(undefined, this.handleSearch)})}
                    /> 
                : null}
                {this.state.displayImportModal ? 
                    <ImportFromFile 
                        onComplete={() => {
                            this.setState({
                                displayImportModal: false
                            })
                            this.refreshCategories(undefined, () => this.refreshTracks(undefined, this.handleSearch))
                        }}
                        onClose={() => {this.setState({displayImportModal: false})}}
                    /> 
                : null}
                {this.state.displayDeleteModal ? 
                <Modal
                    open={true}
                    onClose={() => this.setState({displayDeleteModal: false})}
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    disableBackdropClick={true}
                >
                    <div style={{maxHeight: '600px', width: '500px', background: 'whitesmoke'}}>
                        <div style={modalHeaderStyle}>
                            Delete Item
                        </div>

                        <div style={{fontSize: '20px', marginTop: '40px', marginLeft: '10px'}}>
                            Confirm that you want to delete this item.
                        </div>
                        

                        <Button style={buttonStyle} onClick={() => this.setState({displayDeleteModal: false})}>Cancel</Button>
                        <Button style={buttonStyle} onClick={() => {
                            this.setState({displayDeleteModal: false})
                            if(this.state.currentTrack.displayname != ''){
                                Database.deleteTracks([this.state.currentTrack.id], () => this.refreshTracks())
                            }
                            else if(this.state.currentCategory.name != ''){
                                Database.deleteCategories([this.state.currentCategory.id], () => this.refreshCategories())
                            }
                        }}>Delete</Button>
                    </div>
                </Modal>
                : null}
                <div style={{height: '40px', width: '100%', maxHeight: '40px', display: 'flex', marginBottom: '20px'}}>
                    <Button
                        onClick={() => this.setState({displayTrackModal: true, currentTrack: DefaultTrack})}
                    >
                        Add Track
                    </Button>
                    <Button
                        onClick={() => this.setState({displayCategoryModal: true, currentCategory: DefaultCategory})}
                        style = {{marginLeft: '10px'}}
                    >
                        Add Category
                    </Button>
                    <Button
                        onClick={() => this.setState({deleteMode: !this.state.deleteMode})}
                        style = {{marginLeft: '50px', background: (this.state.deleteMode ? 'linear-gradient(90deg, rgba(197,156,200,1) 0%, rgba(198,198,198,1) 52%, rgba(227,89,89,1) 95%)' : 'white')}}
                    >
                        Delete Mode
                    </Button>
                        
                    <TextField 
                        value = {this.state.searchValue}
                        style = {{marginLeft: '50px', width: '150px', minWidth: '150px'}}
                        onChange = {(event) => {
                            this.setState({
                                searchValue: event.target.value
                            })
                        }}
                        inputProps={{maxLength: 40}}
                    />
                    <Button
                        onClick={() => this.handleSearch()}
                        style = {{background: 'white', marginLeft: '5px'}}
                    >
                        Search
                    </Button>
                    <Select 
                        value={this.state.searchType}
                        style={{marginLeft: '35px'}}
                        onChange={(event) => {
                            this.setState({
                                searchType: event.target.value as SearchType
                            })
                        }}
                    >
                        {SearchTypeStrings.map((s, index) => {
                            return <MenuItem value={index} key={'searchtypest' + index}>{s}</MenuItem>
                        })}
                    </Select>

                    <Button
                        onClick={() => this.setState({displayImportModal: true})}
                        style = {{background: 'white', marginLeft: '50px'}}
                    >
                        Import Category From File
                    </Button>
                    <Button
                        onClick={() => this.setState({displayImportModal: true})}
                        style = {{background: 'white', marginLeft: '50px'}}
                    >
                        Import Category From Youtube Playlist
                    </Button>
                </div>
                <div style={{display: 'flex', width: '100%'}}>
                <List
                    component="nav"
                >
                    <div 
                        style={{display: 'flex'}}
                        key={'listDIV##'}
                    >
                    {this.state.categories.map(c => {
                        return (<div style={{display:'flex', flexDirection:'column', flexWrap: 'wrap', flexBasis: '100%', flex: 1, marginRight: '10px'}} key={'categoryDIV#$'+ c.id}>
                            {this.state.searchData.Categories[c.id] ?
                            <ListItem button onClick={() => {
                                Database.updateCategory({...c, expanded: c.expanded === true ? false : true}, () => this.refreshCategories())
                            }} style={{minWidth: '100px', textAlign: 'left', background: 'linear-gradient(90deg, rgba(209,208,228,1) 0%, rgba(181,181,181,1) 35%, rgba(56,166,189,1) 100%)', borderRadius: '15px'}}
                                onContextMenu={(event) => {
                                    this.handleClick(event)
                                    this.setState({currentCategory: c, currentTrack: DefaultTrack})
                                }}
                                key={'categorylistitem#$' + c.id}
                            >
                                <ListItemText primary={c.name}/>
                            </ListItem> : null}
                        <Collapse in={c.expanded} timeout="auto" unmountOnExit key={'collapseELEMENT%#' + c.id}>
                            <List component="div" disablePadding key={'collapsedLIST#%'+c.id}>
                            {this.state.tracks.filter(t => t.categoryid == c.id).map(t => {
                                return (
                                <>
                                    {this.state.searchData.Tracks[t.id] ? 
                                    <ListItem button style={{paddingLeft: '40px', minWidth: '100px', textAlign: 'left'}} onClick={() => {
                                        if(this.state.deleteMode){
                                            Database.deleteTracks([t.id], () => this.refreshTracks())
                                        }
                                    }} onContextMenu={(event) => {
                                            this.handleClick(event)
                                            this.setState({currentTrack: t, currentCategory: DefaultCategory})
                                        }}
                                        key={'tracklistitem#$' + t.id}
                                    >
                                        <ListItemText primary={t.displayname} />
                                    </ListItem> : null}
                                </>)
                            })}
                            </List>
                        </Collapse>
                        </div>)
                    })}
                    </div>
                </List>


                <Menu
                    keepMounted
                    open={this.state.mouseY !== 0}
                    onClose={this.handleMenuClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                    this.state.mouseY !== 0 && this.state.mouseX !== 0
                        ? { top: this.state.mouseY, left: this.state.mouseX }
                        : undefined
                    }
                >
                    <MenuItem onClick={() => {
                        this.handleMenuClose()
                        if(this.state.currentTrack.displayname != ''){
                            this.setState({
                                displayTrackModal: true
                            })
                        }
                        else if(this.state.currentCategory.name != ''){
                            this.setState({
                                displayCategoryModal: true
                            })
                        }
                        }}>Edit</MenuItem>
                    {this.state.currentCategory.name != '' ? 
                        <MenuItem onClick={() => {
                            this.handleMenuClose()
                            this.setState({
                                displayTrackModal: true,
                                currentTrack: {...DefaultTrack, categoryid: this.state.currentCategory.id}
                            })
                            }}>Add Track
                        </MenuItem> 
                    : null}
                    {this.state.currentCategory.id != 0 ? 
                        <MenuItem onClick={() => {
                            this.handleMenuClose()
                            // if(this.state.currentTrack.displayname != ''){
                            //     Database.deleteTracks([this.state.currentTrack.id], () => this.refreshTracks())
                            // }
                            // else if(this.state.currentCategory.name != ''){
                            //     Database.deleteCategories([this.state.currentCategory.id], () => this.refreshCategories())
                            // }
                            this.setState({displayDeleteModal: true})
                            }}>Delete
                        </MenuItem> 
                    : null}
                    <MenuItem onClick={() => {
                        this.handleMenuClose()
                        if(this.state.currentTrack.displayname != ""){
                            this.props.addTrackToQueue(this.state.currentTrack)
                        }
                        else if(this.state.currentCategory.name != ""){
                            this.state.tracks.forEach(t => {
                                if(t.categoryid == this.state.currentCategory.id)
                                    this.props.addTrackToQueue(t)
                            })
                        }
                        }}>
                        Add To Queue
                    </MenuItem> 
                    </Menu>
                </div>
            </>
        )
    }
}

export default connect(null, actions)(Tracks);