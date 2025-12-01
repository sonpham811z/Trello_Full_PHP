import { useEffect } from "react";
import Container from "@mui/material/Container";
import AppBar from '~/components/AppBar'
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { updateBoardAPI, updateColumnAPI, moveCardsToDifferenceColumns } from "~/apis/index";
import { fetchBoardAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from 'react-redux'
import {  cloneDeep } from "lodash";
import { useParams } from "react-router-dom";
import PageLoading from "~/components/Loading/PageLoading";
import ActiveCard from "~/components/Modal/ActiveCard/ActiveCard";
import ChatAssistant from "~/components/chatbot/ChatAssistant";

function Board() {
    const dispatch = useDispatch()
    const board = useSelector(selectCurrentActiveBoard)
    const {boardId} = useParams() //<Route path="/boards/:boardId" element={<Board />}/> Vì bên kia để URL là :boardId nên phải dùng {boardId}
    useEffect(() => {
      // const boardId = '6766335d1dd57c94436125c4'

      dispatch(fetchBoardAPI(boardId))
    }, [dispatch, boardId])
   

    const moveColumn = async(newOrderedColumn) => {

      const newColumnOrderedIds = newOrderedColumn.map(column => column.id) 
      
      // Lí do dùng Spread operator ko có bug ở đây vì ta ko PUSH gì hết mà  gán bằng cái mảng mới luôn, nhưng đổi luôn cho đồng bộ
      // const newBoard = {...board}

      const newBoard = cloneDeep(board)
      newBoard.column_order_ids = newColumnOrderedIds
      newBoard.columns = newOrderedColumn
      dispatch(updateCurrentActiveBoard(newBoard))
      // setBoard(newBoard)

      //call API update columnOrderIds trong db
      await updateBoardAPI(newBoard.id, {column_order_ids: newBoard.column_order_ids})
    }

    const moveCard = async(newCard, newCardOrderIds, columnId) => {
    
      // ở đây ko dùng được Spread operator vì rule only read của immutablity trong redux thoi tữ lên docs đọc thêm
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(column => column.id === columnId)
      if(columnToUpdate)
      {
        columnToUpdate.cards = newCard
        columnToUpdate.card_order_ids = newCardOrderIds 
      }
      dispatch(updateCurrentActiveBoard(newBoard))
      // setBoard(newBoard)

      // call API keo1 thả card trong cùng 1 column

      await updateColumnAPI(columnId, {card_order_ids: newCardOrderIds})
    }


    // khi kéo thả card giữa các column cần 3 bước
    // 1. Xóa card ở column cũ (Xoá id card trong cardOrderIds của column cũ)
    // 2. Thêm card vào column mới (Thêm id card vào cardOrderIds của column mới)
    // 3. Cập nhật lại lại columnId của card được kéo(update cardId trong db)
    const moveCardsToDifferenceColumn = async (currentCardId, prevColumnId, nextColumnId, newOrderedColumn) =>
    {
      const newColumnOrderedIds = newOrderedColumn.map(column => column.id) 
      const newBoard = cloneDeep(board)
      newBoard.column_order_ids = newColumnOrderedIds
      newBoard.columns = newOrderedColumn
      dispatch(updateCurrentActiveBoard(newBoard))
      // setBoard(newBoard)
      
      // Xử lí trường hợp khi kéo card cuối trong column thì sinh ra card palcecholder không qua dc validation
      // nếu phần tử đầu tiên có placeholder trong id thì cho mảng là rỗng luôn
      let prevCardOrderIds= newOrderedColumn.find(c => c.id === prevColumnId)?.card_order_ids[0].includes('placeholder') ? [] : newOrderedColumn.find(c => c.id === prevColumnId)?.card_order_ids   
           console.log(newOrderedColumn)
      // Call API update khi kéo thả cards khác column ở đây

       moveCardsToDifferenceColumns({
        currentCardId,
        prevColumnId,
        prevCardOrderIds,
        nextColumnId,
        nextCardOrderIds: newOrderedColumn.find(c => c.id === nextColumnId)?.card_order_ids,
       
      })
    }

    if(!board)
    {
      return <PageLoading caption='Loading board'/>
    }
    return (
      <Container disableGutters maxWidth={false} sx={{height:'100vh', backgroundColor: '#primary.main'}}>
        {<ActiveCard/>}
        <AppBar/>
        <BoardBar board = {board}/>
        <BoardContent board = {board}
        moveColumn={moveColumn} moveCard={moveCard} moveCardsToDifferentColumns = {moveCardsToDifferenceColumn} />
        <ChatAssistant/>
      </Container>

    )
}

export default Board;