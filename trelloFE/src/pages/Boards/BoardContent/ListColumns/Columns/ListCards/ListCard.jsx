import Box from '@mui/material/Box';
import Cards from './Cards/Cards';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';




function ListCard({card=[]}) 
{
  const safeCards = Array.isArray(card) ? card.filter(Boolean) : [];

    return (
      <SortableContext items={safeCards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{
            p : '0 5px 5px 5px',
            m: '0 5px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowX: 'hidden',
            overflowY: 'auto',  
            maxHeight: (theme) => `calc(${theme.trello.boardContentheight} - ${theme.trello.boardHeaderHeight} - ${theme.trello.boardFooterHeight} - ${theme.spacing(5)})`,
            
          }}>

            {
              card.map((card) => <Cards key={card.id} card={card}/>)
            }
            
                            
          </Box>

      </SortableContext>


    )
}

export default ListCard