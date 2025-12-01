import Box from "@mui/material/Box";
import AppsIcon from "@mui/icons-material/Apps";
import ModelSelect from "~/components/ModelSelect";
import { ReactComponent as TrelloLogo } from "~/assets/trello.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import WorkSpaces from "~/components/AppBar/Menus/WorkSpaces";
import Recent from "./Menus/Recent";
import Started from "./Menus/Started";
import Template from "./Menus/Template";
import { Badge, Button, Tooltip, TextField, InputAdornment } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from '@mui/icons-material/Search';
import Profile from "./Menus/Profile";
import QueueIcon from '@mui/icons-material/Queue';
import { Link } from "react-router-dom";
import Notifications from '~/components/AppBar/Menus/Notifications'
import { useDispatch } from "react-redux";
import { clearBoardData } from "~/redux/activeBoard/activeBoardSlice";
import { useEffect, useState } from "react";
import { getListBoardsAPI } from "~/apis"; 
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";


function AppBar() {

   const dispatch = useDispatch();
  const onClearBoardData = () => {
    dispatch(clearBoardData())
  }

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [allBoards, setAllBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);

  // load list boards 1 lần khi AppBar mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getListBoardsAPI(''); // không truyền searchPath để lấy full list
        setAllBoards(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to load boards list for search', error);
      }
    };

    fetchBoards();
  }, []);

  // filter theo searchText
  useEffect(() => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setFilteredBoards([]);
      setOpenSearchResult(false);
      return;
    }

    const keyword = trimmed.toLowerCase();

    const result = allBoards.filter((board) =>
      (board.title || '').toLowerCase().includes(keyword)
    );

    setFilteredBoards(result.slice(0, 8)); // limit 8 gợi ý
    setOpenSearchResult(result.length > 0);
  }, [searchText, allBoards]);

  const handleSelectBoard = (boardId) => {
    setSearchText('');
    setOpenSearchResult(false);
    if (boardId) {
      navigate(`/boards/${boardId}`);
    }
  };


  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight ,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        justifyContent: "space-between",
        boxSizing: "border-box",
        gap: 5,
        overflowX: "auto",
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Link to={'/boards'} >
        <Tooltip title='Board List' onClick={onClearBoardData}>
          <AppsIcon sx={{ color: "text.primary", verticalAlign: 'middle' }} />
        </Tooltip>
        
        </Link>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: 'none' }} component={Link} to={'/'}>
          <SvgIcon
            sx={{ color: "text.primary", fontSize: 22,  }}
            component={TrelloLogo}
            inheritViewBox
          />
          <Typography
            variant="h6"
            sx={{ color: "text.primary", fontWeight: "bold" }}
          >
            Trello
          </Typography>
        </Box>

        <Box sx={{display: {xs: 'none', md: 'flex'}, gap: 0.8, marginLeft: 1 ,alignItems: 'center'}}>

          <WorkSpaces />
          <Recent/>
          
          <Started />
          <Template />
          <Button  sx={{ minWidth: '30px', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold', color: 'text.primary' }} variant="outlined" size="small" startIcon={<QueueIcon />}>
            Create
          </Button>
        </Box>
        
        
      </Box>
      {/* Right Section */}
     

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <ModelSelect />

      {/* Bọc TextField trong 1 Box để làm dropdown */}
      <Box sx={{ position: 'relative' }}>
        <TextField
          id="outlined-search"
          placeholder="Search boards"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => {
            if (filteredBoards.length > 0) setOpenSearchResult(true);
          }}
          onBlur={() => {
            // delay chút để user kịp click vào item
            setTimeout(() => setOpenSearchResult(false), 150);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: 'text.primary' }} />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={(theme) => ({
            ...(theme.palette.mode === "dark" && {
              "& .MuiInputLabel-root": { color: "#e1e4e6" },
              "& .MuiOutlinedInput-root": {
                color: "#e1e4e6",
                "& fieldset": { borderColor: "#e1e4e6" },
                "&:hover fieldset": { borderColor: "#e1e4e6" },
                "&.Mui-focused fieldset": { borderColor: "#e1e4e6" },
              }
            }),
            minWidth: '180px',
            maxWidth: '260px'
          })}
        />

        {openSearchResult && filteredBoards.length > 0 &&
  createPortal(
    <Box
      sx={(theme) => ({
        position: 'fixed',
        top: '55px', // vị trí ngay dưới AppBar
        left: 'calc(100% - 370px)', // chỉnh theo UI m
        width: '250px',
        maxHeight: '320px',
        overflowY: 'auto',
        bgcolor: theme.palette.background.paper,
        boxShadow: theme.shadows[6],
        borderRadius: 1,
        zIndex: 9999 // max luôn
      })}
    >
      {filteredBoards.map((board) => (
        <Box
          key={board.id}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleSelectBoard(board.id)}
          sx={(theme) => ({
            padding: '8px 12px',
            cursor: 'pointer',
            borderBottom: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              bgcolor: theme.palette.action.hover
            }
          })}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {board.title}
          </Typography>
          {board.description && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary' }}
              noWrap
            >
              {board.description}
            </Typography>
          )}
        </Box>
      ))}
    </Box>,
    document.body // render ra body → luôn top
  )
}

      </Box>

      <Tooltip>
        <span style={{ display: "inline-flex" }}>
          <Notifications />
        </span>
      </Tooltip>

      <Tooltip title="Help">
        <HelpOutlineIcon sx={{ color: "primary.main", cursor: "pointer" }} />
      </Tooltip>
      <Profile />
    </Box>
    </Box>
  );
}

export default AppBar;
