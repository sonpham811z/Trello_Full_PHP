<?php

namespace App\Services;

use App\Models\Column;
use App\Models\Board;
use App\Models\Card;
use Illuminate\Support\Facades\DB;
use Exception;

class ColumnService
{
    /**
     * Tạo column mới trong board
     */
    public function createColumn(array $data): Column
    {
        $board = Board::findOrFail($data['board_id']);

        return DB::transaction(function () use ($data, $board) {

           $column = Column::create([
                'board_id' => $data['board_id'],
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'card_order_ids' => []
            ]);


            // Thêm ID column mới vào column_order_ids của board
            $order = $board->column_order_ids ?? [];
            $order[] = $column->id;
            $board->update(['column_order_ids' => $order]);

            return $column;
        });
    }

    /**
     * Cập nhật column (đổi tên, vị trí, vv)
     */
    public function updateColumn(string $columnId, array $data): Column
    {
        $column = Column::findOrFail($columnId);
        $column->update($data);
        return $column;
    }

    /**
     * Xoá column (và toàn bộ card bên trong)
     */
    public function deleteColumn(string $columnId): bool
    {
        return DB::transaction(function () use ($columnId) {
            $column = Column::findOrFail($columnId);
            Card::where('column_id', $columnId)->delete();

            // Cập nhật lại column_order_ids trong board
            $board = $column->board;
            if ($board && is_array($board->column_order_ids)) {
                $order = array_filter($board->column_order_ids, fn($id) => $id != $columnId);
                $board->update(['column_order_ids' => array_values($order)]);
            }

            $column->delete();
            return true;
        });
    }

    /**
     * Lấy toàn bộ column + card theo board
     */
    public function getColumnsByBoard(string $boardId)
    {
        $board = Board::with(['columns.cards'])->findOrFail($boardId);
        return $board->columns;
    }

    /**
     * Cập nhật thứ tự card trong column
     */
    public function reorderCards(string $columnId, array $payload)
    {
        $column = Column::findOrFail($columnId);
        $column->update(['card_order_ids' => $payload['ordered_ids']]);
        return $column;
    }

    public function moveCardsBetweenColumns(array $payload)
    {
        return DB::transaction(function () use ($payload) {

            $prevColumn = Column::findOrFail($payload['prevColumnId']);
            $nextColumn = Column::findOrFail($payload['nextColumnId']);

            // 1. Update prev column
            $prevColumn->update([
                'card_order_ids' => $payload['prevCardOrderIds'],
            ]);

            // 2. Update next column
            $nextColumn->update([
                'card_order_ids' => $payload['nextCardOrderIds'],
            ]);

            // 3. Update card current column_id
            Card::where('id', $payload['currentCardId'])->update([
                'column_id' => $payload['nextColumnId']
            ]);

            return ['message' => 'success'];
        });
    }

}
