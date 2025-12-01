"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material"

function ChecklistModal({ newChecklistTitle, setNewChecklistTitle, setShowChecklistModal, handleCreateChecklist }) {
  const handleCreate = () => {
    handleCreateChecklist()
    setNewChecklistTitle("")
  }

  return (
    <Dialog
      open={true}
      onClose={() => setShowChecklistModal(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#2a2a2a",
          borderRadius: "6px",
          transition: "all 0.3s ease",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "#fff",
          p: 1.5,
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        Việc cần làm
      </DialogTitle>

      <DialogContent sx={{ pt: 2, transition: "all 0.3s ease" }}>
        <TextField
          fullWidth
          placeholder="Enter checklist title..."
          value={newChecklistTitle}
          onChange={(e) => setNewChecklistTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleCreate()
          }}
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
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
      </DialogContent>

      <DialogActions
        sx={{
          p: 1.5,
          gap: 1,
          borderTop: "1px solid #1a1a1a",
          transition: "all 0.3s ease",
        }}
      >
        <Button
          onClick={() => setShowChecklistModal(false)}
          sx={{
            color: "#999",
            textTransform: "none",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#fff",
              bgcolor: "#1a1a1a",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleCreate}
          sx={{
            color: "#000",
            bgcolor: "#0ea5e9",
            textTransform: "none",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#06b6d4",
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChecklistModal
