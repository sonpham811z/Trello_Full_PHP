<?php   

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\UserController;

// ========================
// 🔐 PUBLIC AUTH ROUTES
// ========================
Route::post('/register', [UserController::class, 'register']);
Route::post('/verify', [UserController::class, 'verify']);
Route::post('/login', [UserController::class, 'login']);

// ========================
// 🔐 AUTHENTICATED ROUTES
// ========================
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::delete('/logout', [UserController::class, 'logout']);

    // User Profile
    Route::post('/user/update', [UserController::class, 'update']);
    Route::get('/user/profile', [UserController::class, 'profile']);

    // Boards
    Route::post('/boards', [BoardController::class, 'create']);
    Route::get('/boards', [BoardController::class, 'index']);
    Route::get('/boards/{id}', [BoardController::class, 'detail']);
    Route::put('/boards/{id}', [BoardController::class, 'update']);
    Route::delete('/boards/{id}', [BoardController::class, 'delete']);

    // Cards
    Route::post('/cards', [CardController::class, 'create']);
    Route::post('/cards/{id}', [CardController::class, 'update']);
    Route::post('/cards/{id}/comment', [CardController::class, 'addComment']);
    Route::post('/cards/{id}/member', [CardController::class, 'updateMember']);
    Route::delete('/cards/{id}', [CardController::class, 'delete']);
    Route::post('/cards/{id}/labels', [CardController::class, 'addLabel']);
    Route::delete('/card-labels/{id}', [CardController::class, 'removeLabel']);
    Route::post('/cards/{cardId}/checklists', [CardController::class, 'addChecklist']);
    Route::delete('/checklists/{id}', [CardController::class, 'deleteChecklist']);
    Route::post('/checklists/{id}/items', [CardController::class, 'addChecklistItem']);
    Route::patch('/checklist-items/{id}', [CardController::class, 'toggleChecklistItem']);
    Route::delete('/checklist-items/{id}', [CardController::class, 'deleteChecklistItem']);



    // Invitations
    Route::post('/invitations/board', [InvitationController::class, 'create']);
    Route::get('/invitations', [InvitationController::class, 'index']);
    Route::put('/invitations/{id}', [InvitationController::class, 'update']);

    // Columns
    Route::post('/columns', [ColumnController::class, 'create']);
    Route::get('/boards/{boardId}/columns', [ColumnController::class, 'index']);
    Route::put('/columns/{id}', [ColumnController::class, 'update']);
    Route::delete('/columns/{id}', [ColumnController::class, 'delete']);
    Route::post('/columns/{id}/reorder', [ColumnController::class, 'reorderCards']);
    Route::post('/columns/move-between-columns', [ColumnController::class, 'moveBetweenColumns']);
});
?>