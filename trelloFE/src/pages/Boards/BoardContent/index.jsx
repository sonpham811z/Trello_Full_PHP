//eslint-disable
import  { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumn';
import { DndContext, closestCorners ,useSensor, useSensors, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';

import { arrayMove } from '@dnd-kit/sortable';
import Column from './ListColumns/Columns/Column';
import Cards from './ListColumns/Columns/ListCards/Cards/Cards';
import {cloneDeep, isEmpty} from 'lodash';
import { generatePlaceHolderCard } from '~/utils/formatter';

import  { MouseSensor as LibMouseSensor } from '@dnd-kit/core'

// fix lỗi bôi đen text bị nhảy qua event kéo thả
export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown',
      handler: ( event ) => {
        return shouldHandleEvent(event.target)
      }
    }
  ]
}

function shouldHandleEvent(element) {
  let cur = element

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement
  }

  return true
}
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_ITEM_TYPE_CARD'
}


function BoardContent({board, moveColumn, moveCard, moveCardsToDifferentColumns}) {
  // dùng mousesensor và touchesensor để tối ưu trải nghiệm trên mobile
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint:{
      distance: 10 // phải di chuyển lớn hơn 10px thì mới active
    }
  });
  const touchSensor = useSensor(TouchSensor, {
    delay: 250, // nhấn giữ 250ms mới kích hoạt chức năng kéo
    tolerance: 100 // dung sai
  })
  const sensors = useSensors(mouseSensor,touchSensor);
  
  //cùng 1 thời điễm chi có 1 item active
  const [orderedColumn,setOrderedColumn] = useState([]);

  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldStateColumn, setOldStateColumn] = useState(null)

  
  

  useEffect(() => {
    setOrderedColumn(board.columns);
  }, [board]);

  const findColumnByCardId = (id) => {
    return orderedColumn.find(column => column.cards.map(card => card.id).includes(id))
  }

  const moveCardsBetweenDifferentColumns = (
    activeColumn,
    overColumn,
    activeId,
    overId,
    over,
    active,
    triggerFrom
  ) => {
    setOrderedColumn((prev) => {
      const overItems = overColumn.cards.map(card => card.id)
      const overIndex = overItems.indexOf(overId);
      // console.log("overIndex",overIndex);

      let newCardIndex

      
          const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top >
          over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

        newCardIndex =
        overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        const  nextColumn = cloneDeep(prev)
      const nextActiveColumn = nextColumn.find(column => column.id === activeColumn.id)
      const nextOverColumn = nextColumn.find(column => column.id === overColumn.id)
      
      if(nextActiveColumn)
      {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card=>card.id !== activeId)
        if(isEmpty(nextActiveColumn.cards))
        {
          nextActiveColumn.cards = [generatePlaceHolderCard(nextActiveColumn.id)]
        }
        nextActiveColumn.card_order_ids = nextActiveColumn.cards.map(card=>card.id)
      }
      if(nextOverColumn)
      {
        nextOverColumn.cards = nextOverColumn.cards.filter(card=>card.id !== activeId)
        const rebuildCardData = {
          ...active.data.current,
          column_id: nextOverColumn.id
        }          
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex,0,rebuildCardData)  
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => card && !card.FE_PlaceHolder
        );

        nextOverColumn.card_order_ids = nextOverColumn.cards.map(card=>card.id)
      }
      
      
      if(triggerFrom === 'handleDragEnd')
      {
        moveCardsToDifferentColumns(activeId, oldStateColumn.id, nextOverColumn.id, nextColumn)
      }
      
      return nextColumn
    })
  }

  const handleDragStart = (event) => {
    const { active } = event;
    if (!active) return;
  
    setActiveDragItemId(active.id);
    
    
    setActiveDragItemType(
      active.data?.current?.column_id ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(active.data?.current);

    if(event?.active?.data?.current?.column_id)
    {
      setOldStateColumn(findColumnByCardId(active.id))
    }
  };


  const handleDragOver = (event) => {
    const {active,over} = event
      
      
    const overId = over?.id;
    const {id : activeId} = active;
      if(!overId || activeId in orderedColumn)
        return 
    
    const overColumn = findColumnByCardId(overId);
    const activeColumn = findColumnByCardId(activeId);
    
    if(!overColumn || !activeColumn)
      return
    
    if(activeColumn.id != overColumn.id)
    {

      moveCardsBetweenDifferentColumns(activeColumn,overColumn,activeId,overId,over,active,'handleDragOver')  
    }
  }



  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    
    
    
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD)
    {
      const overId = over?.id;
    const {id : activeId} = active;
     
    
    const overColumn = findColumnByCardId(overId);
    const activeColumn = findColumnByCardId(activeId);
    
   
    if(!overColumn || !activeColumn)
      return
  
    
    if ((overColumn || activeColumn) && (oldStateColumn.id != overColumn.id)) {
      moveCardsBetweenDifferentColumns(activeColumn,overColumn,active.id,over.id,over,active,"handleDragEnd")    
    }
    else{
      const oldCardIndex = activeColumn.cards.findIndex(card => card.id === active.id);
      const newCardIndex = activeColumn.cards.findIndex(card => card.id === over.id);
      const newCardOrderIds = arrayMove(activeColumn.card_order_ids, oldCardIndex, newCardIndex);
      const newCards = arrayMove(activeColumn.cards, oldCardIndex, newCardIndex);
      // console.log("oldStateColumn",oldStateColumn);
      
      setOrderedColumn((prev) => {

        const cloneOrderedColumn = cloneDeep(prev);
        cloneOrderedColumn.find(column => column.id === activeColumn.id).card_order_ids = newCardOrderIds
        cloneOrderedColumn.find(column => column.id === activeColumn.id).cards = newCards
        return cloneOrderedColumn
      })
      // console.log("activeColumn",activeColumn);
      
      moveCard(newCards, newCardOrderIds,oldStateColumn.id)
      
    }
    }
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    {
   
      
      if (active.id !== over.id) {
          // Handle column reorder logic
          const oldIndex = orderedColumn.findIndex(column => column.id === active.id);
          const newIndex = orderedColumn.findIndex(column => column.id === over.id);
          const newOrderedColumn = arrayMove(orderedColumn, oldIndex, newIndex);

          moveColumn(newOrderedColumn);

          setOrderedColumn(newOrderedColumn);
        }

    }

    setActiveDragItemData(null);
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setOldStateColumn(null);
    
  
   
  };
  


  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        }
      }
    })
  }


  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver}>
      <Box
        sx={{
          backgroundImage: "url('image.jpg')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: (theme) => theme.trello.boardContentheight,
    width: '100%',
    display: 'flex',
    p: '12px 0 15px 0'
        }}
      >
        <ListColumns column={orderedColumn}/>
        <DragOverlay dropAnimation={dropAnimation} >
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && activeDragItemId && <Column var_cloum={activeDragItemData}/>}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && activeDragItemId && <Cards card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
