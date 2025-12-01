<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('invitations', function (Blueprint $table) {

            // PRIMARY KEY hex ID
            $table->string('id', 24)->primary();

            // INVITER & INVITEE = string(24)
            $table->string('inviter_id', 24);
            $table->string('invitee_id', 24);

            $table->enum('type', ['BOARD_INVITATION'])->default('BOARD_INVITATION');

            // BOARD ID = string(24)
            $table->string('board_id', 24);

            $table->enum('status', ['PENDING', 'REJECTED', 'ACCEPTED'])
                  ->default('PENDING');

            $table->timestamps();
            $table->softDeletes();

            // Foreign keys (thủ công)
            $table->foreign('inviter_id')
                  ->references('id')->on('users')
                  ->cascadeOnDelete();

            $table->foreign('invitee_id')
                  ->references('id')->on('users')
                  ->cascadeOnDelete();

            $table->foreign('board_id')
                  ->references('id')->on('boards')
                  ->cascadeOnDelete();

            $table->index(['invitee_id', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('invitations');
    }
};
