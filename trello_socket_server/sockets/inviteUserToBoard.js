export const inviteUserToBoardSocket = (socket) => {
    socket.on('FE_INVITATION_BOARD', (invitation) => {
        // server đẩy lai data về cho FE (tất cả user) ngoại trừ thằng đẩy data lên
        socket.broadcast.emit('BE_INVITATION_BOARD', invitation)
    })

    socket.on('board_invitation_accepted', ({ inviter_id, dataInvitee }) => {
        console.log(inviter_id, dataInvitee)
        socket.broadcast.emit('board_invitation_accepted', { inviter_id, dataInvitee })
    })
}