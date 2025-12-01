"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  IconButton,
  Divider,
  Tooltip,
  alpha,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"

function LabelPicker({ card, onAdd, onRemove }) {
  const colors = [
    { name: "Green", hex: "#61bd4f" },
    { name: "Yellow", hex: "#f2d600" },
    { name: "Orange", hex: "#ff9f1a" },
    { name: "Red", hex: "#eb5a46" },
    { name: "Purple", hex: "#c377e0" },
    { name: "Blue", hex: "#5ba4cf" },
  ]

  const [labelName, setLabelName] = useState("")
  const [selectedColor, setSelectedColor] = useState(colors[0].hex)

  const handleAdd = () => {
    if (labelName.trim()) {
      onAdd(labelName, selectedColor)
      setLabelName("")
      setSelectedColor(colors[0].hex)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  return (
    <Card
      sx={{
        maxWidth: 500,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Label Name Input */}
          <Box>
            <Typography
              component="label"
              sx={{
                display: "block",
                mb: 1,
                fontSize: "13px",
                fontWeight: 600,
                color: (theme) => theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Label Name
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Bug, Feature, Important..."
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              variant="outlined"
              slotProps={{
                input: {
                  sx: {
                    borderRadius: "8px",
                    fontSize: "14px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) => (theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"),
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) => (theme.palette.mode === "dark" ? "#475569" : "#cbd5e1"),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: "2px",
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Color Palette */}
          <Box>
            <Typography
              component="label"
              sx={{
                display: "block",
                mb: 2,
                fontSize: "13px",
                fontWeight: 600,
                color: (theme) => theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Choose Color
            </Typography>
            <Grid container spacing={0.5}>
              {colors.map((color) => (
                <Grid item xs={4} sm={2} key={color.hex}>
                  <Tooltip title={color.name} arrow>
                    <Box
                      onClick={() => setSelectedColor(color.hex)}
                      sx={{
                        width: 23,
                        height: 23,
                        backgroundColor: color.hex,
                        borderRadius: "10px",
                        cursor: "pointer",
                        border: selectedColor === color.hex ? "3px solid" : "2px solid",
                        borderColor:
                          selectedColor === color.hex ? "#fff" : alpha(color.hex, 0.35),
                        transition: "all .2s ease",
                        boxShadow:
                          selectedColor === color.hex
                            ? `0 0 0 2px ${alpha(color.hex, 0.4)}`
                            : "none",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: `0 4px 12px ${alpha(color.hex, 0.5)}`,
                        },
                      }}
                    />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

          </Box>

          {/* Live Preview */}
          {labelName && (
            <Box
              sx={{
                animation: "fadeIn 0.3s ease-in",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(-8px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: (theme) => theme.palette.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  mb: 1,
                }}
              >
                Preview
              </Typography>
              <Paper
                sx={{
                  backgroundColor: selectedColor,
                  color: "#ffffff",
                  p: 2,
                  textAlign: "center",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  boxShadow: `0 4px 12px ${alpha(selectedColor, 0.3)}`,
                  "&:hover": {
                    boxShadow: `0 6px 20px ${alpha(selectedColor, 0.4)}`,
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "14px" }}>
                  {labelName}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Add Button */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={!labelName.trim()}
            size="medium"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              py: 1.2,
              borderRadius: "8px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              transition: "all 0.3s ease",
              "&:hover:not(:disabled)": {
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: (theme) => (theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"),
              },
            }}
          >
            Add Label
          </Button>
        </Stack>

        {/* Existing Labels Section */}
        {card?.labels && card.labels.length > 0 && (
          <>
            <Divider
              sx={{
                my: 3,
                borderColor: (theme) => (theme.palette.mode === "dark" ? "#334155" : "#e2e8f0"),
              }}
            />
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "16px",
                      letterSpacing: "-0.5px",
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    Existing Labels
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: (theme) => theme.palette.text.secondary,
                      display: "block",
                      mt: 0.5,
                    }}
                  >
                    {card.labels.length} label{card.labels.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={1.5}>
                {card.labels.map((label) => (
                  <Paper
                    key={label.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.75,
                      backgroundColor: alpha(label.color, 0.08),
                      border: `2px solid ${alpha(label.color, 0.2)}`,
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: alpha(label.color, 0.12),
                        borderColor: alpha(label.color, 0.4),
                      },
                    }}
                  >
                    <Chip
                      label={label.name}
                      sx={{
                        backgroundColor: label.color,
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "13px",
                        height: "28px",
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                        boxShadow: `0 2px 8px ${alpha(label.color, 0.3)}`,
                      }}
                      size="small"
                    />
                    <Tooltip title="Remove label" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onRemove(label.id)}
                        sx={{
                          color: (theme) => theme.palette.error.main,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default LabelPicker
