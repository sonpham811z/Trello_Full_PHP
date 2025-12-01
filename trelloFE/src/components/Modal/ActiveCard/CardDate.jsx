"use client"

import { Box, Typography, TextField, Button, Stack, Divider, FormControlLabel, Checkbox, Paper } from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined"

function DatesForm({ date, handleChangeDates, onUpdateDates, onClearDates }) {
  return (
    <Paper
      sx={{
        mt: 2,
        p: 3,
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        animation: "slideIn 0.3s ease-out",
        "@keyframes slideIn": {
          from: {
            opacity: 0,
            transform: "translateY(-12px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              mb: 1,
              color: "#172b4d",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Start Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={date.start_date}
            onChange={(e) => handleChangeDates("start_date", e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "6px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(12, 102, 228, 0.1)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0c66e4",
                  },
                },
              },
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              mb: 1,
              color: "#172b4d",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Due Date
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={date.due_date}
            onChange={(e) => handleChangeDates("due_date", e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "6px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(12, 102, 228, 0.1)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0c66e4",
                  },
                },
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={date.is_completed}
              onChange={(e) => handleChangeDates("is_completed", e.target.checked)}
              sx={{
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(12, 102, 228, 0.08)",
                },
              }}
            />
          }
          label={<Typography sx={{ fontSize: 13, fontWeight: 500, color: "#172b4d" }}>Mark card as done</Typography>}
        />

        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={onUpdateDates}
            sx={{
              backgroundColor: "#0c66e4",
              color: "#fff",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: "0 2px 4px rgba(12, 102, 228, 0.15)",
              "&:hover": {
                backgroundColor: "#0052cc",
                boxShadow: "0 4px 8px rgba(12, 102, 228, 0.25)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            Save
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={onClearDates}
            sx={{
              borderColor: "#ccc",
              color: "#172b4d",
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              transition: "all 0.2s ease-in-out",
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#f4f5f7",
                borderColor: "#aaa",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            Clear
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default DatesForm
