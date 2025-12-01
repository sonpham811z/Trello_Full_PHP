import  { useState } from 'react';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCardIcon from '@mui/icons-material/AddCard';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCard from './ListCards/ListCard';
import { useSortable } from '@dnd-kit/sortable';
import {  Button, Tooltip, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {CSS} from '@dnd-kit/utilities'
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
import { createNewCardAPI } from '~/apis/index';
import { cloneDeep } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { deleteColumnAPI } from '~/apis/index';
import ToggleFocusInput from '~/components/form/ToggleFocusInput'
import { updateColumnAPI } from '~/apis/index';

function Column({var_cloum}) {
    const dispatch = useDispatch()
    const board = useSelector(selectCurrentActiveBoard)

    const [stateAddCard, setStateAddCard] = useState(false);
      const toggleAddCard= () => {
          setStateAddCard(!stateAddCard);
      }

      const onChangedValue = (newValue) => {
        updateColumnAPI(var_cloum.id, {title: newValue})
        const newBoard = cloneDeep(board)
        const columnToUpdate = newBoard.columns.find(column => column.id === var_cloum.id)
        if(columnToUpdate)
        {
          columnToUpdate.title = newValue
        }
        dispatch(updateCurrentActiveBoard(newBoard))
      }

      const [newCardTitle,setNewCardTitle] = useState('');
      const addNewCard = async () => {
          if(!newCardTitle) {
              toast.error('Enter title of card bro', {
                  position:'bottom-left',
                  theme:'colored'
              });
              return            
          } 

          // CALL API TO CREATE NEW CARD
          const newCardData = {
              title: newCardTitle,
              column_id: var_cloum.id
          }
          
          const result = await createNewCardAPI({
              ...newCardData,
              board_id: board.id
          })

          const newBoard = cloneDeep(board)
          const columnToUpdate = newBoard.columns.find(column => column.id === result.column_id)
          if(columnToUpdate)
          {
            columnToUpdate.cards.push(result)
            columnToUpdate.card_order_ids.push(result.id)
          }
          dispatch(updateCurrentActiveBoard(newBoard))


          toast.success('Card added successfully', {
              position:'bottom-left',
              theme: 'colored'
          });
          toggleAddCard();
          setNewCardTitle('');
      }

      const confirm = useConfirm();
      const handleRemoveColumn = () => {
        confirm({ 
          title: 'Are you confirm to remove this column?',
          description: 'This column will be permanently deleted',
          confirmationText: 'Confirm',
          confirmationButtonProps: {
            variant: 'outlined',
            color: 'error',
          },
          cancellationText: 'Cancel',
          allowClose: false,
        }).then(async () => {

          // Xử lí data và call API delete column
          const newBoard = cloneDeep(board)
          newBoard.column_order_ids = newBoard.column_order_ids.filter(id => id !== var_cloum.id)
          newBoard.columns = newBoard.columns.filter(column => column.id !== var_cloum.id)
          
          
          dispatch(updateCurrentActiveBoard(newBoard))
          
          await deleteColumnAPI(var_cloum.id, board.id).then(() => {
            toast.success('Delete column  successfully', {
              position:'bottom-left',
              theme: 'colored'
          });
          })
        })
       

        }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
      } = useSortable({id: var_cloum.id, cards:var_cloum.cards ,data: {...var_cloum}});
    const style = {
      transform: CSS.Translate.toString(transform),
      transition,
      opacity: isDragging?0.5:undefined,
      height: '100%'

    }
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setAnchorEl(null);
    };
    const orderedCart = var_cloum.cards


    return (
      <div ref={setNodeRef} style={style} {...attributes} >
        <Box 
        {...listeners}
        sx={{
            minWidth: 260,
            maxWidth: 260,
            borderRadius: '6px',
            bgcolor: (theme) => theme.palette.mode === 'light' ? '#f5f2f2' : '#424242',
            ml: 2,
            height: 'fit-content',
            maxHeight: (theme) => `calc(${theme.trello.boardContentheight} - ${theme.spacing(5)})`,
          }} >

            {/* name of column */}
            <Box sx={{
              height:(theme) => theme.trello.boardHeaderHeight,
              p:2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              color: 'black'
            }}>
                {/* <Typography variant = 'h8' sx={
                  {
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1.0rem'
                  }
                }>{var_cloum.title}</Typography> */}
                <ToggleFocusInput onChangedValue={onChangedValue} value={var_cloum.title} data-no-dnd={true} />
                <Box>
                <Tooltip title="More options">
                <ExpandMoreIcon 
                  sx={{color: 'text.secondary', cursor: 'pointer'}}
                   id="basic-column-dropdown"
                   aria-controls={open ? 'basic-column-dropdown' : undefined}
                   aria-haspopup="true"
                   aria-expanded={open ? 'true' : undefined}
                   onClick={handleClick}
                />
                </Tooltip>
                <Menu
                  id="basic-column-dropdown"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose} 
                  MenuListProps={{
                    'aria-labelledby': 'basic-column-dropdown',
                  }}
                >
                  <MenuItem onClick={toggleAddCard} sx = {{
                    '&:hover': {color: '#0288d1 ',
                      '& .icon_add_card': {color: '#0288d1'}
                    }}}
                    
                    >
                    <ListItemIcon className='icon_add_card' >
                      <AddCardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText >Add new card</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                    
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                   
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleRemoveColumn} sx={{
                    '&:hover': {color: 'red ',
                      '& .icon_bin': {color: 'red'}
                    },
                  }}>
                    <ListItemIcon className='icon_bin'>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Remove this column</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Cloud fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive this column</ListItemText>
                  </MenuItem>
              </Menu>
            </Box>
            </Box>

            {/*Content */}
                <ListCard card={orderedCart}/>

            {/* Footer */}
           {!stateAddCard ?
            <Box  sx={{
              height: (theme) => theme.trello.boardFooterHeight ,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button onClick={toggleAddCard} sx={{fontWeight: 'bold', fontSize: 12}} startIcon={<AddCardIcon sx={{fontSize: 29}} />}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{cursor: 'pointer', fontSize:20}}/>
              </Tooltip>
            </Box>
            :
            <Box data-no-dnd='true'
            sx={{
                height: (theme) => theme.trello.boardFooterHeight ,
                display: 'flex',
                alignItems: 'center',
                gap:1,
                p:1.3,
    
            }}
            >
            <TextField
                onChange={(e)=> setNewCardTitle(e.target.value)}
                id="outlined-search"
                label="Enter column title..."
                type='search'
                variant="outlined"
                size="small"
                width="100%"
                autoFocus
                sx={(theme) => ({
                  ...(theme.palette.mode === "dark" && {
                    "& .MuiInputLabel-root": { color: "#e1e4e6" }, // Màu label
                    "& .MuiOutlinedInput-root": {
                      color: "#e1e4e6", // Màu chữ khi nhập
                      "& fieldset": { borderColor: "#e1e4e6" }, // Viền mặc định
                      "&:hover fieldset": { borderColor: "#e1e4e6" }, // Viền hover
                      "&.Mui-focused fieldset": { borderColor: "#e1e4e6" }, // Viền focus
                    }
                  })})}
               
               
            />

            <Box sx={{display: 'flex', alignItems: 'center', gap:1}}>
                <Button 
                    variant='contained'
                    size='small'      
                    onClick={addNewCard}  
                    className='interceptor-loading'                 
            
                >
                    Add
                </Button>
                <CloseIcon onClick={toggleAddCard} sx={{
                    cursor:'pointer',
                    color:(theme)=>theme.palette.primary.main,
                    '&:hover':{
                        opacity:0.8
                    }

                    }}/>
                
            </Box>
      </Box>

           }

        </Box>

      </div>
          
    )
}

export default Column