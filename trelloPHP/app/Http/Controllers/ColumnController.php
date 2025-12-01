<?php

namespace App\Http\Controllers;

use App\Services\ColumnService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class ColumnController extends Controller
{
    protected $columnService;

    public function __construct(ColumnService $columnService)
    {
        $this->columnService = $columnService;
    }

    public function create(Request $request)
    {

        $request->validate([
            'board_id' => 'required|string|exists:boards,id',
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:255',
        ]);
        try {
            $column = $this->columnService->createColumn($request->all());
            return response()->json($column, 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()],  500);
        }
    }

    public function index($boardId)
    {
        try {
            $columns = $this->columnService->getColumnsByBoard($boardId);
            return response()->json($columns);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'nullable|string|min:3|max:100',
            'position' => 'nullable|integer',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            $column = $this->columnService->updateColumn($id, $request->all());
            return response()->json($column);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function delete($id)
    {
        try {
            $this->columnService->deleteColumn($id);
            return response()->json(['message' => 'Column deleted']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function reorderCards(Request $request, $id)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'string|exists:cards,id'
        ]);

        try {
            $column = $this->columnService->reorderCards($id, $request->ordered_ids);
            return response()->json($column);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

        public function moveBetweenColumns(Request $request)
    {
        $data = $request->validate([
            'currentCardId' => 'required|string',
            'prevColumnId' => 'required|string',
            'prevCardOrderIds' => '',
            'nextColumnId' => 'required|string',
            'nextCardOrderIds' => 'required|array',
        ]);

        try {
            $result = $this->columnService->moveCardsBetweenColumns($data);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getCode() ?: 500);
        }
    }

}


