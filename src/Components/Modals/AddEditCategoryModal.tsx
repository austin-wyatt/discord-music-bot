import * as React from 'react';
import { Button, Modal, TextField } from '@material-ui/core'; 
import { Category, DefaultCategory} from '../../types';
import * as Database from '../../Dexie/Database'

interface IProps{
    category: Category
    onClose: () => void
}

interface IState{
    currentCategory: Category,
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


class AddEditCategoryModal extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);

        this.state = {
            currentCategory: {...this.props.category}
        }
    }

    render(){
        let addEditText = this.state.currentCategory.id == DefaultCategory.id ? 'Add Category' : 'Edit Category'
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
                                Name:
                            </div>
                            <TextField 
                                value = {this.state.currentCategory.name}
                                style = {textFieldStyle}
                                inputProps={{ maxLength: 40 }}
                                onChange = {(event) => {
                                    this.setState({
                                        currentCategory: {...this.state.currentCategory, name: event.target.value}
                                    })
                                }}
                            />
                        </div>

                        {(this.state.currentCategory.id != DefaultCategory.id || this.props.category.name != '') && this.state.currentCategory.id != 0 ? 
                            <Button style={{...buttonStyle, float: 'left', marginLeft: '10px'}} onClick={() => {
                                Database.deleteCategories([this.state.currentCategory.id], () => {
                                    this.props.onClose()
                                })
                            }}>Delete</Button>
                        : null}

                        <Button style={buttonStyle} onClick={() => {
                            if(this.state.currentCategory.id == DefaultCategory.id && this.props.category.name == ""){
                                let category = this.state.currentCategory;
                                if(category.name == ''){
                                    category.name = '<TEMP>'
                                }
                                Database.addCategory(category, () => {
                                    this.props.onClose()
                                })
                            }
                            else
                                Database.updateCategory(this.state.currentCategory, () => {
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

export default AddEditCategoryModal;