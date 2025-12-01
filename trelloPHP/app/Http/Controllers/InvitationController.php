<?php

namespace App\Http\Controllers;

use App\Services\InvitationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class InvitationController extends Controller
{
    protected $invitationService;

    public function __construct(InvitationService $invitationService)
    {
        $this->invitationService = $invitationService;
    }

    public function create(Request $request)
    {
        $request->validate([
            'invitee_email' => 'required|email|exists:users,email',
            'board_id' => 'required|string|exists:boards,id'
        ]);

        try {
            $response = $this->invitationService->createBoardInvitation(Auth::id(), $request->all());
            return response()->json($response, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function index()
    {
        try {
            $invitations = $this->invitationService->getInvitations(Auth::id());
            return response()->json($invitations);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:PENDING,REJECTED,ACCEPTED']);

        try {
            $updated = $this->invitationService->updateBoardInvitation(Auth::id(), $id, $request->all());
            return response()->json($updated);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()],  500);
        }
    }
}
