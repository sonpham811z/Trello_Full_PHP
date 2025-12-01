<?php

namespace App\Http\Controllers;

use App\Services\BoardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Exception;

class BoardController extends Controller
{
    protected $boardService;
    public function __construct(BoardService $boardService)
    {
        $this->boardService = $boardService;
    }

    public function create(Request $request)
    {
        $request->validate([
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:255',
            'type' => 'in:public,private'
        ]);

        try {
            $board = $this->boardService->createBoard(Auth::id(), $request->all());
            return response()->json($board, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $boards = $this->boardService->getBoards(Auth::id(), $request->get('page', 1));
            return response()->json($boards);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function detail($id)
    {
        try {
            $board = $this->boardService->getBoardDetail(Auth::id(), $id);
            return response()->json($board);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()],  500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $board = $this->boardService->updateBoard($id, $request->all());
            return response()->json($board);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function delete($id)
    {
        try {
            $this->boardService->deleteBoard($id);
            return response()->json(['message' => 'Board deleted']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
}
