"use client"

import { Box, Typography, IconButton, TextField, Button, Checkbox, LinearProgress } from "@mui/material"
import { ExpandLess, ExpandMore, Delete as DeleteIcon } from "@mui/icons-material"
import ChecklistIcon from '@mui/icons-material/Checklist';

function CardChecklist({
  checklists,
  calcProgress,
  collapsed,
  toggleCollapse,
  addItemText,
  handleChangeItemInput,
  onAddChecklistItem,
  onToggleItem,
  onDeleteItem,
  onDeleteChecklist,
}) {
  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <ChecklistIcon/>

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            color: "#fff",
          }}
        >
          CheckLists
        </Typography>
      </Box>

      {/* Checklists List */}
      {checklists.map((ch) => {
        const isCollapsed = collapsed[ch.id]
        const progress = calcProgress(ch)

        return (
          <Box
            key={ch.id}
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 0.8,
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
                <IconButton
                  onClick={() => toggleCollapse(ch.id)}
                  size="small"
                  sx={{
                    color: "#fff",
                    p: 0.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#0ea5e9",
                    },
                  }}
                >
                  {isCollapsed ? <ExpandMore sx={{ fontSize: "20px" }} /> : <ExpandLess sx={{ fontSize: "20px" }} />}
                </IconButton>

                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    color: "#fff",
                    flex: 1,
                    transition: "color 0.2s ease",
                  }}
                >
                  {ch.title}
                </Typography>
              </Box>

              <IconButton
                onClick={() => onDeleteChecklist(ch.id)}
                size="small"
                sx={{
                  color: "#999",
                  p: 0.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#ff6b6b",
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: "18px" }} />
              </IconButton>
            </Box>

            <Box sx={{ px: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#999",
                  }}
                >
                  Progress
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#0ea5e9",
                    fontWeight: 500,
                  }}
                >
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: "3px",
                  bgcolor: "#1a1a1a",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#0ea5e9",
                    transition: "width 0.3s ease",
                  },
                }}
              />
            </Box>

            {/* Items List */}
            {!isCollapsed && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  animation: "slideDown 0.3s ease",
                  "@keyframes slideDown": {
                    from: {
                      opacity: 0,
                      maxHeight: 0,
                    },
                    to: {
                      opacity: 1,
                      maxHeight: "1000px",
                    },
                  },
                }}
              >
                {ch.items.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                    }}
                  >
                    {ch.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          py: 1,
                          px: 1.5,
                          borderBottom: "1px solid #1a1a1a",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "#1a1a1a",
                          },
                          "&:last-of-type": {
                            borderBottom: "none",
                          },
                        }}
                      >
                        <Checkbox
                          checked={item.is_done}
                          onChange={() => onToggleItem(item.id, !item.is_done)}
                          size="small"
                          sx={{
                            color: "#555",
                            p: 0.5,
                            transition: "all 0.2s ease",
                            "&.Mui-checked": {
                              color: "#0ea5e9",
                            },
                            "&:hover": {
                              color: "#0ea5e9",
                            },
                          }}
                        />

                        <Typography
                          sx={{
                            ml: 1,
                            color: item.is_done ? "#666" : "#fff",
                            textDecoration: item.is_done ? "line-through" : "none",
                            flex: 1,
                            fontSize: "0.9rem",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {item.text}
                        </Typography>

                        <IconButton
                          onClick={() => onDeleteItem(item.id)}
                          size="small"
                          sx={{
                            color: "#666",
                            p: 0.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              color: "#ff6b6b",
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Add Item Input */}
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Add new item..."
                    value={addItemText[ch.id] || ""}
                    onChange={(e) => handleChangeItemInput(ch.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") onAddChecklistItem(ch.id)
                    }}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        fontSize: "0.9rem",
                        bgcolor: "#1a1a1a",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor: "#444",
                          transition: "all 0.2s ease",
                        },
                        "&:hover fieldset": {
                          borderColor: "#555",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#0ea5e9",
                        },
                      },
                      "& .MuiOutlinedInput-input::placeholder": {
                        color: "#666",
                        opacity: 1,
                      },
                    }}
                  />

                  <Button
                    onClick={() => onAddChecklistItem(ch.id)}
                    size="small"
                    sx={{
                      color: "#fff",
                      bgcolor: "#1a1a1a",
                      border: "1px solid #444",
                      textTransform: "none",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#0ea5e9",
                        borderColor: "#0ea5e9",
                        color: "#000",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default CardChecklist
