import { useState, useRef, useEffect } from "react"
import { Box, Paper, TextField, IconButton, Stack, Typography, Fab, Fade, Badge, Divider } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import CloseIcon from "@mui/icons-material/Close"
import ChatIcon from "@mui/icons-material/Chat"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import { styled } from "@mui/material/styles"

const MessageBubble = styled(Paper)(({ theme }) => ({
  padding: "10px 14px",
  borderRadius: "12px",
  maxWidth: "55%",
  wordWrap: "break-word",
  animation: "slideIn 0.3s ease-out",
  "@keyframes slideIn": {
    from: {
      opacity: 0,
      transform: "translateY(8px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}))

const UserMessage = styled(MessageBubble)(({ theme }) => ({
  backgroundColor: "#93c5fd",
  color: "#1e3a8a",
  marginLeft: "auto",
  boxShadow: "0 2px 8px rgba(147, 197, 253, 0.3)",
}))

const AssistantMessage = styled(MessageBubble)(({ theme }) => ({
  backgroundColor: "#f1f5f9",
  color: "#1e293b",
  marginRight: "auto",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
}))

function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3000/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await res.json()
      const botMessage = { role: "assistant", content: data.reply }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Box>
      {/* Floating Action Button */}
      <Fab
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          background: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
          boxShadow: "0 8px 16px rgba(147, 197, 253, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: 45,
          height: 45,
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 12px 24px rgba(147, 197, 253, 0.5)",
          },
        }}
      >
        <Badge >
          {open ? (
            <CloseIcon sx={{ color: "#fff", fontSize: 20 }} />
          ) : (
            <ChatIcon sx={{ color: "#fff", fontSize: 20 }} />
          )}
        </Badge>
      </Fab>

      {/* Chat Window */}
      <Fade in={open}>
        <Paper
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: { xs: 280, sm: 280 },
            height: { xs: 360, sm: 350 },
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            borderRadius: "16px",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            background: "#fff",
            animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            "@keyframes slideUp": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
              color: "#fff",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1, fontSize: "0.875rem" }}>
              AI Assistant
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages Container */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "#fafbfc",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "3px",
                "&:hover": {
                  backgroundColor: "#94a3b8",
                },
              },
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  textAlign: "center",
                  gap: 0.5,
                  color: "#64748b",
                }}
              >
                <SmartToyIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.75rem" }}>
                  Start a conversation
                </Typography>
              </Box>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <Stack
                    key={index}
                    sx={{
                      alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                      width: "100%",
                    }}
                  >
                    {msg.role === "user" ? (
                      <UserMessage elevation={0}>{msg.content}</UserMessage>
                    ) : (
                      <AssistantMessage elevation={0}>{msg.content}</AssistantMessage>
                    )}
                  </Stack>
                ))}
                {loading && (
                  <Stack sx={{ alignItems: "flex-start", width: "100%" }}>
                    <AssistantMessage elevation={0}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Box
                          sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#64748b",
                            animation: "bounce 1.4s infinite",
                          }}
                        />
                        <Box
                          sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#64748b",
                            animation: "bounce 1.4s infinite 0.2s",
                          }}
                        />
                        <Box
                          sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#64748b",
                            animation: "bounce 1.4s infinite 0.4s",
                            "@keyframes bounce": {
                              "0%, 60%, 100%": { opacity: 0.5 },
                              "30%": { opacity: 1 },
                            },
                          }}
                        />
                      </Box>
                    </AssistantMessage>
                  </Stack>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          <Divider sx={{ margin: 0 }} />

          {/* Input Area */}
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "#fff",
              display: "flex",
              gap: 0.75,
              alignItems: "flex-end",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              multiline
              maxRows={2}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f1f5f9",
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#93c5fd",
                    borderWidth: 2,
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "0px 8px",
                  fontSize: "0.75rem",
                },
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              sx={{
                background: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)",
                color: "#fff",
                padding: "px",
                borderRadius: "6px",
                transition: "all 0.2s",
                minWidth: "36px",
                height: "36px",
                "&:hover:not(:disabled)": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 12px rgba(147, 197, 253, 0.4)",
                },
                "&:disabled": {
                  opacity: 0.6,
                },
              }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </Box>
  )
}

export default ChatAssistant