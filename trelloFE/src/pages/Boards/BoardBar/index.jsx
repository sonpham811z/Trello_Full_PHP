import { useState } from "react";
import Box from "@mui/material/Box";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Chip from "@mui/material/Chip";
import VpnLockIcon from'@mui/icons-material/VpnLock';
import AddToggDrive from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterIcon from '@mui/icons-material/FilterList';
import { Tooltip } from "@mui/material";
import {capitalizerFisrtletter} from "~/utils/formatter";
import BoardUserGroup from './BoardUserGroup'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import InviteBoardUser from "./InviteBoardUser";
import { updateBoardAPI } from "~/apis";

function BoardBar({board}) {
  //const {board} = props có thể viết như này
  const [openSortMenu, setOpenSortMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch()

  const handleOpenSortMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenSortMenu(true);
  };
  
  const handleCloseSortMenu =  () => {
    setOpenSortMenu(false);
    setAnchorEl(null);
  };

  const handleSortColumns = async (type) => {
    if(!board || !board.columns) {
      return
    }

    console.log(board)

    let sorted = [...board.columns]

    switch (type) {
      case "A-Z":
        sorted.sort((a,b) => a.title.localeCompare(b.title))
        break

      case "Z-A":
        sorted.sort((a,b) => b.title.localeCompare(a.title))
        break
      
      case "CREATED_ASC":
        sorted.sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
        break

      case "CREATED_DESC":
        sorted.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
        break
  }
  const newOrder = sorted.map(col => col.id)
  const newBoard = {
    ...board,
    columns: sorted,
    column_order_ids: newOrder
  }

  dispatch(updateCurrentActiveBoard(newBoard))
  await updateBoardAPI(newBoard.id, {column_order_ids: newOrder})
  handleCloseSortMenu()
}
  
  return (
        
        <Box
            px={2}
            sx={{
                width: "100%",
                height: (theme) => theme.trello.boardBarHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                overflowX: "auto",
                borderTop: "1px solid #e0e0e0",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                
                  <Tooltip title={board?.description} >
                    <Chip sx={{
                        height: 28,
                        fontSize: 12,
                        fontWeight: 'bold',
                        bgcolor: 'white',
                        size: 'small',
                        color: 'primary.main',
                        border: 'none',
                        paddingX: '2px',
                        borderRadius: '5px',
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main'
                        },
                        '&:hover': {
                          bgcolor: 'primary.50',
                        }


                    }}
                    label={board?.title}
                    icon={<DashboardIcon sx={{
                      fontSize: 18,
                    }} />}
                    onClick={() =>{}}
                />
                  </Tooltip>
                   
                <Chip
                    sx={{
                        height: 28,
                        fontSize: 12,
                        fontWeight: 'bold',
                        bgcolor: 'white',
                        color: 'primary.main',
                        border: 'none',
                        paddingX: '5px',
                        borderRadius: '5px',
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main'
                        },
                        '&:hover': {
                          bgcolor: 'primary.50',
                        }


                    }}
                    label={capitalizerFisrtletter(board?.type||'')}
                    icon={<VpnLockIcon sx={{fontSize: 18}}/>}
                    onClick={() =>{}}
                />

                  <Chip
                    sx={{
                        height: 28,
                        fontSize: 12,
                        fontWeight: 'bold',
                        bgcolor: 'white',
                        color: 'primary.main',
                        border: 'none',
                        paddingX: '5px',
                        borderRadius: '5px',
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main'
                        },
                        '&:hover': {
                          bgcolor: 'primary.50',
                        }
                    }}
                    label="Add to Google Drive"
                    icon={<AddToggDrive sx={{fontSize: 18}}/>}
                    onClick={() =>{}}
                />

                  <Chip
                    sx={{
                      height: 28,
                        fontSize: 12,
                        fontWeight: 'bold',
                        bgcolor: 'white',
                        color: 'primary.main',
                        border: 'none',
                        paddingX: '5px',
                        borderRadius: '5px',
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main'
                        },
                        '&:hover': {
                          bgcolor: 'primary.50',
                        }
                    }}
                    label="Automation"
                    icon={<BoltIcon sx={{fontSize:18}}/>}
                    onClick={() =>{}}
                />
                <Chip
                    sx={{
                      height: 28,
                        fontSize: 12,
                        fontWeight: 'bold',
                        bgcolor: 'white',
                        color: 'primary.main',
                        border: 'none',
                        paddingX: '5px',
                        borderRadius: '5px',
                        '& .MuiSvgIcon-root': {
                          color: 'primary.main'
                        },
                        '&:hover': {
                          bgcolor: 'primary.50',
                        }
                    }}
                    label="Filter"
                    icon={<FilterIcon sx={{fontSize: 18}}/>}
                    onClick={handleOpenSortMenu}
                />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <InviteBoardUser board_id = {board.id}/>
            <BoardUserGroup boardUsers={board.allUsers}/>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={openSortMenu}
              onClose={handleCloseSortMenu}
              elevation={3}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={() => handleSortColumns("A-Z")}>Sắp xếp A → Z</MenuItem>
              <MenuItem onClick={() => handleSortColumns("Z-A")}>Sắp xếp Z → A</MenuItem>
              <MenuItem onClick={() => handleSortColumns("CREATED_ASC")}>CreatedAt ↑</MenuItem>
              <MenuItem onClick={() => handleSortColumns("CREATED_DESC")}>CreatedAt ↓</MenuItem>
            </Menu>

        </Box>
    );
}

export default BoardBar;
