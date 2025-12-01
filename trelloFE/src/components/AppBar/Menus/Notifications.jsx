import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '~/socket'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateCurrentNotifications } from '~/redux/notifications/notificationsSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentNotifications, fetchInvitationsAPI, updateBoardInvitationAPI } from '~/redux/notifications/notificationsSlice'
import { addNotifications } from '~/redux/notifications/notificationsSlice'
import { useNavigate } from 'react-router-dom'
const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [newNoti, setNewNoti] = useState(false)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNoti(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector(selectCurrentNotifications)


  useEffect(() => {
    dispatch(fetchInvitationsAPI())

    // Tạo function xử lí sự kiện realtime

    const onReceiveInvitation = (invitation) => {
      if(invitation.invitee_id === currentUser.id)
      {
        // Đẩy invitation vào board

        dispatch(addNotifications(invitation))
        setNewNoti(true)
      }
    }

    socket.on('BE_INVITATION_BOARD', onReceiveInvitation)

    return () => {
      socket.off('BE_INVITATION_BOARD', onReceiveInvitation)
    }
  }, [dispatch, currentUser.id])

  const updateBoardInvitation = (status, notificationId) => {
    dispatch(updateBoardInvitationAPI({notificationId, status})).then((res) => {
      console.log(res.payload.status)
      if(res.payload.status === BOARD_INVITATION_STATUS.ACCEPTED) {
         navigate(`/boards/${res.payload.board_id}`)
        console.log(currentUser)

        const dataInvitee = {
          id: currentUser.user.id,
          email: currentUser.user.email,
          userName: currentUser.user.userName,
          display_name: currentUser.user.display_name,
          avatar: currentUser.user.avatar
        }

        // emit socket event để thông báo cho inviter cập nhật board
        
        socket.emit('board_invitation_accepted', {
          inviter_id: res.payload.inviter_id,
          dataInvitee
        })
        }
      if(res.payload.status === BOARD_INVITATION_STATUS.REJECTED) {
        dispatch(updateCurrentNotifications({
          id: notificationId,
          status: BOARD_INVITATION_STATUS.REJECTED
        }));
      }
       
    })
  
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          // variant="none"
          variant={newNoti ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            // color: 'white'
                color: 'text.primary',

          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {( !notifications || notifications.length === 0) && <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 300,
              overflowY: 'auto'
            }}>
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box sx={{fontSize: 12}}><strong>{notification.inviter?.display_name}</strong> had invited you to join the board <strong></strong></Box>
                </Box>

                {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                {notification?.status === BOARD_INVITATION_STATUS.PENDING && 
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      sx={{ fontSize: 12}}
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification.id)}
                    >
                      Reject
                    </Button>
                  </Box>
                
                }

                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>

                  {notification.status ===BOARD_INVITATION_STATUS.ACCEPTED && 
                    <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                  }

                  {notification.status ===BOARD_INVITATION_STATUS.REJECTED && 
                    <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                  }
                  
                </Box>

                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification.createAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== (notifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
