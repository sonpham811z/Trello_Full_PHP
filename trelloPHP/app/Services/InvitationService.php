<?php

namespace App\Services;

use App\Models\User;
use App\Models\Board;
use App\Models\Invitation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

use Exception;

class InvitationService
{

    public function createBoardInvitation(string $inviterId, array $data)
    {
        $inviter = User::find($inviterId);
        $invitee = User::where('email', $data['invitee_email'])->first();
        $board   = Board::find($data['board_id']);

        if (!$inviter || !$invitee || !$board) {
            throw new Exception('Email or board not found', 404);
        }

        $invitation = Invitation::create([
            'inviter_id' => $inviter->id,
            'invitee_id' => $invitee->id,
            'type'       => 'BOARD_INVITATION',
            'board_id'   => $board->id,
            'status'     => 'PENDING'
        ]);

        
        return [
            'invitation' => $invitation,
            'board'      => $board,
            'inviter'    => $inviter,
            'invitee'    => $invitee,
        ];
    }


    public function getInvitations(string $userId)
    {
        return Invitation::with(['inviter', 'invitee', 'board'])
            ->where('invitee_id', $userId)
            ->get();
    }


    public function updateBoardInvitation(string $userId, string $invitationId, array $status)
    {
        return DB::transaction(function () use ($userId, $invitationId, $status) {
            $invitation = Invitation::findOrFail($invitationId);
            $board = Board::findOrFail($invitation->board_id);

            // Nếu user đã ở trong board mà lại accept nữa
            $alreadyMember = $board->members()->where('user_id', $userId)->exists();
            if ($alreadyMember && $status['status'] === 'ACCEPTED') {
                throw new Exception('User is already in the board', 422);
            }

            $invitation->update(['status' => $status['status']]);

            if ($status['status'] === 'ACCEPTED') {
                $board->members()->attach($userId);
            }

            return $invitation;
        });
    }
}
