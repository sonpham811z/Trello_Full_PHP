<?php

namespace App\Services;

use App\Models\Board;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Exception;

class BoardService
{
    public function createBoard(string $ownerId, array $data): Board
    {
        return DB::transaction(function () use ($ownerId, $data) {
            $slug = Str::slug($data['title']);

            $board = Board::create([
                'owner_id' => $ownerId,
                'title' => $data['title'],
                'slug' => $slug,
                'description' => $data['description'] ?? '',
                'type' => $data['type'] ?? 'private',
                'column_order_ids' => []
            ]);

            return $board;
        });
    }

public function getBoardDetail(string $userId, string $boardId)
{
    $board = Board::with([
        'columns.cards.labels',
        'columns.cards.checklists.items', // ✔ load checklist + items
        'columns.cards.members:id',
        'owner',
        'members'
    ])->findOrFail($boardId);

    // CHECK PERMISSION
    $isMember = $board->owner_id === $userId 
             || $board->members->contains('id', $userId);

    if (!$isMember) {
        throw new Exception('Access denied', 403);
    }

    // REORDER cards theo card_order_ids
    foreach ($board->columns as $col) {

        if (is_array($col->card_order_ids) && !empty($col->card_order_ids)) {

            $map = $col->cards->keyBy('id');
            $sorted = [];

            foreach ($col->card_order_ids as $cid) {
                if (isset($map[$cid])) {

                    $card = $map[$cid];

                    // Lấy member IDs (list id)
                    $memberIds = DB::table('card_user')
                        ->where('card_id', $cid)
                        ->pluck('user_id');

                    $card->setAttribute('members', $memberIds);

                    $sorted[] = $card;
                }
            }

            $col->setRelation('cards', collect($sorted));

        } else {

            foreach ($col->cards as $card) {

                $memberIds = DB::table('card_user')
                    ->where('card_id', $card->id)
                    ->pluck('user_id');

                $card->setAttribute('members', $memberIds);
            }
        }
    }

    return $board;
}



    public function getBoards(string $userId, int $page = 1, int $perPage = 8)
    {
        return Board::where(function ($q) use ($userId) {
                $q->where('owner_id', $userId)
                  ->orWhereHas('members', fn($m) => $m->where('user_id', $userId));
            })
            ->orderBy('title', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function updateBoard(string $boardId, array $data): Board
    {
        $board = Board::findOrFail($boardId);
        $board->update($data);
        return $board;
    }

    public function deleteBoard(string $boardId)
    {
        $board = Board::findOrFail($boardId);
        $board->delete();
        return true;
    }
}
