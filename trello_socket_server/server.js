import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoard.js'
import {env} from './config/environment.js'
import { GoogleGenAI } from "@google/genai"

const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*" }
})
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

app.post("/api/assistant", async (req, res) => {
  try {
    const userMessages = req.body.messages || []

    const systemPrompt = `
                  Nhiệm vụ của bạn là hỗ trợ người dùng sử dụng ứng dụng.
            Luôn trả lời bằng tiếng Việt, ngắn gọn, thân thiện, dễ hiểu.
            Bạn chỉ được trả lời về các tính năng liên quan đến ứng dụng, bao gồm:

                - tạo board, chỉnh sửa board, tìm kiếm board

                - thêm / sửa / xoá column

                - thêm / sửa / xoá card

                - gán và quản lý label

                - tạo checklist, thêm item, đánh dấu hoàn thành

                 - đặt ngày bắt đầu, hạn chót (due date)

                - upload cover / attachment

                - mời thành viên, phân quyền trong board

                - Cách đổi avatar, tên, mật khẩu

                - hướng dẫn thao tác theo từng bước (step-by-step)

                - giải thích lỗi giao diện hoặc lỗi thao tác

                - gợi ý cách tổ chức công việc hiệu quả trong board

            Bạn tuyệt đối KHÔNG trả lời các nội dung ngoài ứng dụng, ví dụ:
            chính trị, lập trình backend/front-end, đời sống, toán học, triết học, code, AI model, hay bất kỳ chủ đề nào không thuộc ứng dụng Trello.

            Nếu người dùng hỏi sai phạm vi, hãy từ chối nhẹ nhàng kiểu:
            “Oops, có vẻ câu hỏi này không nằm trong tính năng của ứng dụng rồi ^^.”

            Luôn giữ tone: thân thiện, trẻ trung, dễ hiểu.
    `

    let conversation = systemPrompt + "\n\n"

    userMessages.forEach((m) => {
      conversation += (m.role === "user" ? "User: " : "Assistant: ") + m.content + "\n"
    })

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversation
    })

    return res.json({
      reply: response.text
    })
  } catch (err) {
    console.error("AI ERROR:", err)
    return res.json({ reply: "Xin lỗi, AI đang gặp lỗi." })
  }
})


io.on("connection", (socket) => {
  console.log("User connected:", socket.id)
  inviteUserToBoardSocket(socket)
})


const PORT = 3000
server.listen(PORT, () => {
    console.log(env.GEMINI_API_KEY)
  console.log("🔥 Server running on port", PORT)
})
