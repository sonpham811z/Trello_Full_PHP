
import { Box, Card, CardContent, CardMedia, Typography, Chip, IconButton } from "@mui/material"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDispatch } from "react-redux"
import { showingModal, updateCurrentActiveCard } from "~/redux/activeCard/activeCardSlice"
import {
  WatchLaterOutlined,
  CheckOutlined,
} from "@mui/icons-material"
import { useState } from "react"
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice"
import { updateCardDetailAPI } from "~/apis"

function Cards({ card }) {
  
  const dispatch = useDispatch()
  const [isHovered, setIsHovered] = useState(false)


  const handleOpenActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showingModal())
  }

  const onCompleteCard =async (cardId, payload) => {
      // Gọi API chung update card
      const data = await updateCardDetailAPI(cardId, payload);
      dispatch(updateCurrentActiveCard(data));
      dispatch(updateCardInBoard(data));
  }
  const handleCompleteCard = (e) => {
    e.stopPropagation()
    console.log(card.id)
    console.log(card.is_completed)
    if (onCompleteCard) {
      onCompleteCard(card.id, {is_completed: !card.is_completed})
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { ...card },
  })

  const CardStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  const getDueStatus = (card) => {
    if (!card.due_date) return "none"
    if (card.is_completed) return "done"

    const now = new Date()
    const due = new Date(card.due_date)

    if (due < now) return "overdue"

    const diffMs = due - now
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffDays <= 1) return "soon"
    return "normal"
  }

  const getDueBg = (card) => {
    const status = getDueStatus(card)
    if (status === "done") return "#10b981"
    if (status === "overdue") return "#ef4444"
    if (status === "soon") return "#f59e0b"
    return "transparent"
  }

  const getDueBorderColor = (card) => {
    const status = getDueStatus(card)
    if (status === "done") return "#10b981"
    if (status === "overdue") return "#ef4444"
    if (status === "soon") return "#f59e0b"
    if (status === "normal") return "#3b82f6"
    return "#9ca3af"
  }

  const shouldShowCompleteButton = isHovered || card.is_completed

  return (
    <Card
      onClick={handleOpenActiveCard}
      ref={setNodeRef}
      style={CardStyle}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: "pointer",
        width: "100%",
        height: card?.FE_PlaceHolder ? 0 : 'unset',
        overflow: card?.FE_PlaceHolder ? "hidden" : "visible",
        backgroundColor: "#1f2937",
        border: card?.FE_PlaceHolder ? "" : "2px solid transparent",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        flexDirection: "column",
        position: "relative",
        transition: "border-color 0.2s ease-in-out",
        "&:hover": {
          borderColor: getDueBorderColor(card),
        },
      }}
    >
      {card?.labels && card.labels.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            p: "12px 16px",
            flexWrap: "wrap",
          }}
        >
          {card.labels.map((label) => (
            <Chip
              key={label.id}
              label={label.name}
              size="small"
              sx={{
                height: "22px",
                backgroundColor: label.color,
                color: "#fff",
                fontWeight: 600,
                fontSize: "11px",
                "& .MuiChip-label": {
                  padding: "0 8px",
                },
              }}
            />
          ))}
        </Box>
      )}

      {card?.cover && (
        <CardMedia
          sx={{
            height: 140,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2.2
          }}
          image={card.cover}
          title={card.title}
        />
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            padding: "12px 16px",
            transition: "transform 0.2s ease-in-out",
             transform: shouldShowCompleteButton ? "translateX(22px)" : "translateX(0)",
            "&:last-child": {
              paddingBottom: "12px",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 500,
              lineHeight: 1.5,
              color: "#f3f4f6",
              wordWrap: "break-word",
            }}
          >
            {card.title}
          </Typography>
        </CardContent>

        {shouldShowCompleteButton && (
          <IconButton
            onClick={handleCompleteCard}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              position: "absolute",
              left: "8px",
              width: "18px",
              height: "18px",
              minWidth: "18px",
              backgroundColor: card.is_completed ? "#10b981" : "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              border: "1.5px solid rgba(255, 255, 255, 0.2)",
              transition: "all 0.2s ease-in-out",
              flexShrink: 0,
              "&:hover": {
                backgroundColor: "#10b981",
                borderColor: "#10b981",
              },
            }}
          >
            <CheckOutlined sx={{ fontSize: "14px" }} />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: "12px 16px",
        }}
      >
        {card.due_date && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              paddingX: 1,
              paddingY: "4px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: getDueBg(card),
              color: "#fff",
              width: "fit-content",
            }}
          >
            <WatchLaterOutlined sx={{ fontSize: "12px" }} />
            {new Date(card.due_date).toLocaleDateString()}
          </Box>
        )}


      </Box>
    </Card>
  )
}

export default Cards
