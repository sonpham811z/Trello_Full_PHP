import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentActiveCard, selectCurrentActiveCard, selectIsShowModal, updateCurrentActiveCard} from '~/redux/activeCard/activeCardSlice';
import { updateCardDetailAPI, updateCardCommentlAPI, updateCardMemberAPI } from '~/apis/index';
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice';
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import LabelPicker from '~/components/Modal/ActiveCard/CardLabel'
import DatesForm from './CardDate'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { createLabel, removeLabel } from '~/apis/index'
import { createChecklistAPI, createChecklistItemAPI, toggleChecklistItemAPI, deleteChecklistAPI, deleteChecklistItemAPI } from '~/apis/index'
import CardChecklist from './CheckList/CheckList'
import ChecklistModal from './CheckList/CheckListModal'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  // const [isOpen, setIsOpen] = useState(true)
  // const handleOpenModal = () => setIsOpen(true)
  const dispatch = useDispatch()
  const showModal = useSelector(selectIsShowModal);
  const activeCardData = useSelector(selectCurrentActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const memberIds = activeCardData?.members?.map(m => m.id)
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showDatesPanel, setShowDatesPanel] = useState(false);
  const [datesForm, setDatesForm] = useState({
      start_date: '',
      due_date: '',
      is_completed: false
  });
  const [checklists, setChecklists] = useState(activeCardData?.checklists || []);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [addItemText, setAddItemText] = useState({});
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (id) => {
  setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calcProgress = (checklist) => {
  if (!checklist.items?.length) return 0;
  const done = checklist.items.filter(i => i.is_done).length;
  return Math.round((done / checklist.items.length) * 100);
};

const onDeleteChecklist = async (id) => {
  await deleteChecklistAPI(id);

  const updated = {
    ...activeCardData,
    checklists: activeCardData.checklists.filter(ch => ch.id !== id)
  };

  dispatch(updateCurrentActiveCard(updated));
  dispatch(updateCardInBoard(updated));
};

const onDeleteItem = async (itemId) => {
  await deleteChecklistItemAPI(itemId);

  const updated = {
    ...activeCardData,
    checklists: activeCardData.checklists.map(ch => ({
      ...ch,
      items: ch.items.filter(i => i.id !== itemId)
    }))
  };

  dispatch(updateCurrentActiveCard(updated));
  dispatch(updateCardInBoard(updated));
};





  useEffect(() => {
  setChecklists(activeCardData?.checklists || []);
}, [activeCardData]);



const handleChangeItemInput = (id, text) => {
  setAddItemText(prev => ({ ...prev, [id]: text }));
};

const onAddChecklistItem = async (checklistId) => {
  const text = addItemText[checklistId];
  if (!text?.trim()) return;

  const res = await createChecklistItemAPI(checklistId, text);

  const updated = {
    ...activeCardData,
    checklists: activeCardData.checklists.map(ch =>
      ch.id === checklistId
        ? { ...ch, items: [...ch.items, res] }
        : ch
    )
  };

  dispatch(updateCurrentActiveCard(updated));
  dispatch(updateCardInBoard(updated));

  setAddItemText(prev => ({ ...prev, [checklistId]: '' }));
};

const onToggleItem = async (itemId, is_done) => {
  const res = await toggleChecklistItemAPI(itemId, is_done);

  const updated = {
    ...activeCardData,
    checklists: activeCardData.checklists.map(ch => ({
      ...ch,
      items: ch.items.map(item =>
        item.id === itemId ? { ...item, is_done: res.is_done } : item
      )
    }))
  };

  dispatch(updateCurrentActiveCard(updated));
  dispatch(updateCardInBoard(updated));
};



  //===================== DATE MODAL =========================
  const openDatesPanel = () => {
    setDatesForm({
      start_date: activeCardData?.start_date
        ? activeCardData.start_date.slice(0, 10) // yyyy-mm-dd
        : '',
      due_date: activeCardData?.due_date
        ? activeCardData.due_date.slice(0, 10)
        : '',
      is_completed: !!activeCardData?.is_completed
    });
    setShowDatesPanel(prev => !prev);
  };

const handleChangeDates = (field, value) => {
  setDatesForm(prev => ({ ...prev, [field]: value }));
};

const onUpdateDates = async () => {
  const payload = {
    start_date: datesForm.start_date || null,
    due_date: datesForm.due_date || null,
    is_completed: datesForm.is_completed
  };

  // Gọi API chung update card
  const data = await updateCardDetailAPI(activeCardData.id, payload);
  dispatch(updateCurrentActiveCard(data));
  dispatch(updateCardInBoard(data));
  setShowDatesPanel(false);
};

const onClearDates = async () => {
  const payload = {
    start_date: null,
    due_date: null,
    is_completed: false
  };
  const data = await updateCardDetailAPI(activeCardData.id, payload);
  dispatch(updateCurrentActiveCard(data));
  dispatch(updateCardInBoard(data));
  setShowDatesPanel(false);
};

  //===================== lABEL MODAL =========================

  const onAddLabel = async (name, color) => {
  const res = await createLabel(name, color, activeCardData)

  const updated = {
    ...activeCardData,
    labels: [...(activeCardData.labels || []), res],
  };

  dispatch(updateCurrentActiveCard(updated));
  dispatch(updateCardInBoard(updated));
};

const onRemoveLabel = async (labelId) => {
  await removeLabel(labelId)

  const updated = {
    ...activeCardData,
    labels: activeCardData.labels.filter(l => l.id !== labelId)
  };

  dispatch(updateCurrentActiveCard(updated));
  dispatch(updateCardInBoard(updated));
};



  //===================== OTHER FEATURE =========================

  const handleCloseModal = () => {
    setShowLabelPicker(false);
    setShowDatesPanel(false);
    dispatch(clearCurrentActiveCard())
  }

  const onUpdateCardMember = async (dataMemberInfo) => {
    await updateCardMemberAPI(activeCardData.id, dataMemberInfo).then((res) => {
        console.log(dataMemberInfo)
        dispatch(updateCurrentActiveCard(res))
        dispatch(updateCardInBoard(res))
    })
  }

  const onUpdateCardTitle = async (newTitle) => {
    const data = await updateCardDetailAPI(activeCardData.id, {title: newTitle})
    dispatch(updateCurrentActiveCard(data))

    dispatch(updateCardInBoard(data))
  }

  const onUpdateCardDescription = async(newDescription) => {
    const data = await updateCardDetailAPI(activeCardData.id, {description: newDescription})
    dispatch(updateCurrentActiveCard(data))
    dispatch(updateCardInBoard(data))

  }

  const onUploadCardCover = (event) => {
    console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cover', event.target?.files[0])

    // Gọi API...
    toast.promise(updateCardDetailAPI(activeCardData.id,reqData), {
      pending: 'Uploading...'
    }).then(res => {
      console.log(res);
      if(!res.error)
      {
        dispatch(updateCurrentActiveCard(res))
        dispatch(updateCardInBoard(res))
      }
      
    }).finally(() => event.target.value = '')
  }

  //===================== COMMENT =========================
  const onAddCardComments =async (data) => {
    console.log(data)
    toast.promise(updateCardCommentlAPI(activeCardData.id,data), {
      pending: 'Uploading...'
    }).then(res => {
      console.log(res);
      if(!res.error)
      {
        dispatch(updateCurrentActiveCard(res))
        dispatch(updateCardInBoard(res))
      }
      
    })
  }

   const handleCreateChecklist = async () => {
    if (!newChecklistTitle.trim()) return;

    const checklist = await createChecklistAPI(activeCardData.id, newChecklistTitle);

    const updated = {
      ...activeCardData,
      checklists: [...(activeCardData.checklists || []), checklist]
    };

    dispatch(updateCurrentActiveCard(updated));
    dispatch(updateCardInBoard(updated));

    setNewChecklistTitle('');
    setShowChecklistModal(false);
  };

  return (
    <Modal
      disableScrollLock
      open={showModal}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

       {activeCardData?.cover &&  <Box sx={{ mb: 4 }}>
          <img
            style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
            src={activeCardData.cover}
            alt={activeCardData?.description}
          />
        </Box>}

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCardData?.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup cardMemberIds={memberIds} onUpdateCardMember={onUpdateCardMember} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor description = {activeCardData?.description} onDescriptionChange={onUpdateCardDescription} />
            </Box>

            {/* CHECKLIST SECTION */}
             <CardChecklist
              checklists={checklists}
              calcProgress={calcProgress}
              collapsed={collapsed}
              toggleCollapse={toggleCollapse}
              addItemText={addItemText}
              handleChangeItemInput={handleChangeItemInput}
              onAddChecklistItem={onAddChecklistItem}
              onToggleItem={onToggleItem}
              onDeleteItem={onDeleteItem}
              onDeleteChecklist={onDeleteChecklist}
            />



            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection onAddCardComments={onAddCardComments} comments={activeCardData?.comments}/>
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              { !activeCardData?.members?.includes(currentUser.id) && 
                <SidebarItem className="active" onClick={() => onUpdateCardMember({userId: currentUser._id, action: 'ADD'})}>
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              }
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem><AttachFileOutlinedIcon fontSize="small" />Attachment</SidebarItem>
              <SidebarItem onClick={() => setShowLabelPicker(!showLabelPicker)}>
                <LocalOfferOutlinedIcon fontSize="small" />Labels
             </SidebarItem>

                {showLabelPicker && (
                  <LabelPicker
                    card={activeCardData}
                    onAdd={onAddLabel}
                    onRemove={onRemoveLabel}
                  />
                )}

              <SidebarItem onClick={() => setShowChecklistModal(true)}>
                <TaskAltOutlinedIcon fontSize="small" />Checklist
              </SidebarItem>
                  {showChecklistModal && (
                    <ChecklistModal newChecklistTitle={newChecklistTitle} setNewChecklistTitle={setNewChecklistTitle} setShowChecklistModal={setShowChecklistModal} handleCreateChecklist={handleCreateChecklist}/>
                  )}

              <SidebarItem onClick={openDatesPanel}>
                <WatchLaterOutlinedIcon fontSize="small" />Dates
              </SidebarItem>

              {showDatesPanel && (
               <DatesForm date={datesForm} handleChangeDates={handleChangeDates} onUpdateDates={onUpdateDates} onClearDates={onClearDates}/>
              )}
              <SidebarItem><AutoFixHighOutlinedIcon fontSize="small" />Custom Fields</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><AspectRatioOutlinedIcon fontSize="small" />Card Size</SidebarItem>
              <SidebarItem><AddToDriveOutlinedIcon fontSize="small" />Google Drive</SidebarItem>
              <SidebarItem><AddOutlinedIcon fontSize="small" />Add Power-Ups</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
              <SidebarItem><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem>
              <SidebarItem><AutoAwesomeOutlinedIcon fontSize="small" />Make Template</SidebarItem>
              <SidebarItem><ArchiveOutlinedIcon fontSize="small" />Archive</SidebarItem>
              <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>



    </Modal>
    
  )

  
}



export default ActiveCard

