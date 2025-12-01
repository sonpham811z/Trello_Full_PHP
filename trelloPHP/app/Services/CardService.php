<?php

namespace App\Services;

use App\Models\Card;
use App\Models\Column;
use App\Models\CardLabel;
use App\Models\ChecklistItem;
use App\Models\CardChecklist;
use Illuminate\Support\Facades\DB;
use Exception;
use Cloudinary\Cloudinary;
use Symfony\Polyfill\Intl\Idn\Info;

class CardService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        // Khởi tạo Cloudinary đúng cách
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ]
        ]);
    }

    public function createCard(array $data): Card
    {
        $column = Column::findOrFail($data['column_id']);

        return DB::transaction(function () use ($data, $column) {
            
            $card = Card::create([
                'board_id'  => $column->board_id,
                'column_id' => $column->id,
                'title'     => $data['title'],
                'description' => $data['description'] ?? null,
                'cover'       => $data['cover'] ?? null,
                'comments'    => []
            ]);

            // Update column.card_order_ids
            $order = $column->card_order_ids ?? [];
            $order[] = $card->id;
            $column->update(['card_order_ids' => $order]);

            return $card;
        });
    }


    public function updateCard(string $cardId, array $data, $coverFile): Card
    {
        $card = Card::findOrFail($cardId);
        if ($coverFile) {

            $result = $this->cloudinary->uploadApi()->upload(
                $coverFile->getRealPath(),
                ["folder" => "cardCover"]
            );
            $card->cover = $result['secure_url'];   // nên dùng field cover
        }
        else {
            $card->fill($data);
        }
        
        $card->save();
        return $card;
    }

    public function updateCardMember(string $cardId, array $info): Card
    {
        $card = Card::findOrFail($cardId);

        if ($info['action'] === 'ADD') {
            $card->members()->attach($info['user_id']);
        } elseif ($info['action'] === 'REMOVE') {
            $card->members()->detach($info['user_id']);
        } else {
            throw new Exception('Invalid action');
        }

        return $card->load('members');
    }

    public function addComment(string $cardId, array $comment)
    {
        $card = Card::findOrFail($cardId);
        $comments = $card->comments ?? [];
        array_unshift($comments, [
            'user_id' => $comment['user_id'],
            'user_email' => $comment['user_email'],
            'user_avatar' => $comment['user_avatar'] ?? null,
            'user_display_name' => $comment['user_display_name'] ?? null,
            'commented_at' => now()->toDateTimeString(),
            'text' => $comment['text']
        ]);
        $card->comments = $comments;
        $card->save();
        return $card;
    }

    public function deleteCard(string $cardId)
    {
        $card = Card::findOrFail($cardId);
        $card->delete();
        return true;
    }

    public function addLabel(string $cardId, array $data)
    {
        $card = Card::findOrFail($cardId);

        $label = CardLabel::create([
            'card_id' => $cardId,
            'name' => $data['name'],
            'color' => $data['color']
        ]);

        return $label;
    }

    public function removeLabel(string $labelId)
    {
        $label = CardLabel::findOrFail($labelId);
        $label->delete();
        return true;
    }

    public function addChecklist($cardId, $data)
    {
        $checklist = CardChecklist::create([
            'card_id' => $cardId,
            'title' => $data['title']
        ]);

        return $checklist->load('items');
    }

    public function addChecklistItem($checklistId, $data)
    {
        return ChecklistItem::create([
            'checklist_id' => $checklistId,
            'text' => $data['text']
        ]);
    }

    public function toggleChecklistItem($itemId, $data)
    {
        $item = ChecklistItem::findOrFail($itemId);
        $item->is_done = $data['is_done'];
        $item->save();
        return $item;
    }

    public function deleteChecklist($checklistId)
    {
        ChecklistItem::where('checklist_id', $checklistId)->delete();
        return CardChecklist::where('id', $checklistId)->delete();
    }

    public function deleteChecklistItem($itemId)
    {
        return ChecklistItem::where('id', $itemId)->delete();
    }

}
