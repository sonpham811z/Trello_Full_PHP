import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { socket } from '~/socket'
import { cloneDeep } from 'lodash'

function BoardUserGroup({ boardUsers = [], limit = 4 }) {
  /**
   * Xử lý Popover để ẩn hoặc hiện toàn bộ user trên một cái popup, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const board = useSelector(selectCurrentActiveBoard)
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  useEffect(() => {
    const onBoardInvitationAccepted = ({ inviter_id, dataInvitee }) => {
      console.log(inviter_id)
      console.log(dataInvitee)
      if (currentUser.user.id === inviter_id) {
        let newBoardDataRedux = cloneDeep(board);
        
        console.log(dataInvitee)
        newBoardDataRedux.members.push(dataInvitee);
        newBoardDataRedux.allUsers.push(dataInvitee);
        
        dispatch(updateCurrentActiveBoard(newBoardDataRedux));

      }
    };
  
    socket.on('board_invitation_accepted', onBoardInvitationAccepted);
  
    return () => {
      socket.off('board_invitation_accepted', onBoardInvitationAccepted);
    };
  }, [board, currentUser, dispatch]);
  

  // Lưu ý ở đây chúng ta không dùng Component AvatarGroup của MUI bởi nó không hỗ trợ tốt trong việc chúng ta cần custom & trigger xử lý phần tử tính toán cuối, đơn giản là cứ dùng Box và CSS - Style đám Avatar cho chuẩn kết hợp tính toán một chút thôi.
  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {/* Hiển thị giới hạn số lượng user theo số limit */}
      {boardUsers.map((user, index) => {
        if (index < limit) {
          return (
            <Tooltip  key={index}>
              <Avatar
                sx={{ width: 30, height: 30, cursor: 'pointer' }}
                alt="avatar"
                src={user.avatar}
              />
            </Tooltip>
          )
        }
      })}

      {/* Nếu số lượng users nhiều hơn limit thì hiện thêm +number */}
      {boardUsers.length > limit &&
        <Tooltip title="Show more">
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: 30,
              height: 30,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{boardUsers.length - limit}
          </Box>
        </Tooltip>
      }

      {/* Khi Click vào +number ở trên thì sẽ mở popover hiện toàn bộ users, sẽ không limit nữa */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '235px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {boardUsers.map((user, index) =>
            <Tooltip  key={index}>
              <Avatar
                sx={{ width: 30, height: 30, cursor: 'pointer' }}
                alt="userImg"
              />
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup
