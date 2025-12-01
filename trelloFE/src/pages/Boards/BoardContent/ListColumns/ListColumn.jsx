import  {useState} from 'react'
import Column from './Columns/Column';
import Box from '@mui/material/Box';
import AddBoxIcon from '@mui/icons-material/AddBox';
// import { TextField } from '@mui/icons-material';
import {  Button, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import {generatePlaceHolderCard} from '~/utils/formatter'
import {createNewColumnAPI} from '~/apis/index'
import { cloneDeep } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';


function ListColumns({column}) {

    const dispatch = useDispatch()
    const board = useSelector(selectCurrentActiveBoard) 

    const [stateAddColumn, setStateAddColumn] = useState(false);
    const toggleAddColumn = () => {
        setStateAddColumn(!stateAddColumn);
    }
    const [newColumnTitle,setNewColumnTitle] = useState('');
    const addNewColumn = async () => {
        if(!newColumnTitle) {
            toast.error('Enter title of column bro', {
                position:'bottom-right',
                theme:'colored'
            });
            return            
        } 

        const newColumnData = {
            title: newColumnTitle,
            description: ""
        }


        // Call API để tạo 1 column mới
        const result = await createNewColumnAPI({
            ...newColumnData,
            board_id: board.id
        })
        
        result.cards = [generatePlaceHolderCard(result)]
        result.card_order_ids = [generatePlaceHolderCard(result).id]
        console.log(result)
        // Ở đây nếu dùng toán tử ... để copy thỉ sẽ có bug là 'Cannot add property 3, object is not extensible'
        // vì Immutablity của redux (tính bất biến): không  được PUSH trực tiếp vào board ban đầu
        // phải copy quia biến mới để sửa nhưng vì toán từ ... là shallow copy, nên vẩn cần liên kết với original board => dùng clonedeep của Lodash
        // const newBoard = {...board}
        
        const newBoard = cloneDeep(board)
        newBoard.columns.push(result)
        newBoard.column_order_ids.push(result.id)
        dispatch(updateCurrentActiveBoard(newBoard)) //newBoard truyền vào đây sẽ là action.payload trong  redux và chỉ cần truyền 1 tham số thôi
        // setBoard(newBoard)

        toast.success('Column added successfully', {
            position:'bottom-right',
            theme: 'colored'
        });
        toggleAddColumn();
        setNewColumnTitle('');
        
        
    }

    return (
        <SortableContext items={column.map((column) => column.id)} strategy={horizontalListSortingStrategy}>
            <Box sx={{
                display: 'flex',
                bgcolor:'inherit',
                width: '100%',  
                height: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',

            }}>
                {
                    column.map((column) => <Column key={column?.id} var_cloum={column}/>)
                }

                {!stateAddColumn
                    ?
                    <Box  onClick={toggleAddColumn} sx={{
                        minWidth: '200px',
                        maxWidth: '200px',
                        bgcolor: '#ffffff3d',
                        height: 'fit-content',
                        mx: 2,
                        justifyContent: 'center',
                        borderRadius: 1,
                    }}>
                        <Button
                        
                        startIcon={<AddBoxIcon />}
                        sx={{
                            color: 'white',
                            width: '100%',
                            padding: '8px 0',
                            fontSize: 12
                        }} >
                            Add a column
                        </Button>
                    </Box> 
                    :
                    <Box
                        sx={{
                            minWidth: '200px',
                            maxWidth: '200px',
                            bgcolor: 'white',
                            height: 'fit-content',
                            mx: 2,
                            p:1,
                            display: 'flex', // Sử dụng flexbox
                            borderRadius: 1,
                            flexDirection: 'column',
                            gap:1,
                           
                        }}
                        >
                        <TextField
                            onChange={(e)=> setNewColumnTitle(e.target.value)}
                            id="outlined-search"
                            label="Enter column title..."
                            type='search'
                            variant="outlined"
                            size="small"
                            width="100%"
                            autoFocus
                           
                        />

                    <Box sx={{display: 'flex', alignItems: 'center', gap:1}}>
                        <Button 
                            variant='contained'
                            size='small'      
                            onClick={addNewColumn}                   
                            className='interceptor-loading'
                            sx={{fontSize: 10}}
                        >
                            Add column
                        </Button>
                        <CloseIcon onClick={toggleAddColumn} sx={{
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
        </SortableContext>
    )
}

export default ListColumns