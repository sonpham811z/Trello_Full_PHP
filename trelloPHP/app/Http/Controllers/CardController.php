<?php

namespace App\Http\Controllers;

use App\Services\CardService;
use Illuminate\Http\Request;
use Exception;

class CardController extends Controller
{
    protected $cardService;
    public function __construct(CardService $cardService)
    {
        $this->cardService = $cardService;
    }

    public function create(Request $request)
    {
        $request->validate([
            'column_id' => 'required|string|exists:board_columns,id',
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string',
            'cover' => 'nullable|string',
        ]);

        try {
            $card = $this->cardService->createCard($request->all());
            return response()->json($card, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $card = $this->cardService->updateCard($id, $request->all(), $request->file('cover'));
            return response()->json($card);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()],  500);
        }
    }

    public function updateMember(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:ADD,REMOVE',
            'user_id' => 'required|string|exists:users,id'
        ]);

        try {
            $card = $this->cardService->updateCardMember($id, $request->all());
            return response()->json($card);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function addComment(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|string|exists:users,id',
            'text' => 'required|string|min:1'
        ]);

        try {
            $card = $this->cardService->addComment($id, $request->all());
            return response()->json($card);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function delete($id)
    {
        try {
            $this->cardService->deleteCard($id);
            return response()->json(['message' => 'Card deleted']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
    public function addLabel(Request $request, $cardId)
    {
        $request->validate([
            'name' => 'required|string',
            'color' => 'required|string'
        ]);

        $label = $this->cardService->addLabel($cardId, $request->all());
        return response()->json($label);
    }

    public function removeLabel($labelId)
    {
        $this->cardService->removeLabel($labelId);
        return response()->json(['message' => 'deleted']);
    }

    public function addChecklist(Request $request, $cardId)
    {
        $request->validate(['title' => 'required|string']);
        return response()->json(
            $this->cardService->addChecklist($cardId, $request->all())
        );
    }

    public function addChecklistItem(Request $request, $checklistId)
    {
        $request->validate(['text' => 'required|string']);
        return response()->json(
            $this->cardService->addChecklistItem($checklistId, $request->all())
        );
    }

    public function toggleChecklistItem(Request $request, $itemId)
    {
        return response()->json(
            $this->cardService->toggleChecklistItem($itemId, $request->all())
        );
    }

    public function deleteChecklistItem($itemId)
    {
        return response()->json(
            $this->cardService->deleteChecklistItem($itemId)
        );
    }

    public function deleteChecklist($checklistId)
    {
        return response()->json(
            $this->cardService->deleteChecklistItem($checklistId)
        );
    }

}
