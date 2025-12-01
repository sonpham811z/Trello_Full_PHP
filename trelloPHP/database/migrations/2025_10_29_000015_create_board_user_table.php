<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('board_user', function (Blueprint $table) {

            // Primary key có thể dùng hex luôn (an toàn hơn)
            $table->string('id', 24)->primary();

            // BOARD ID = string(24)
            $table->string('board_id', 24);

            // USER ID = string(24)
            $table->string('user_id', 24);

            $table->timestamps();

            $table->foreign('board_id')
                  ->references('id')->on('boards')
                  ->cascadeOnDelete();

            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->cascadeOnDelete();

            $table->unique(['board_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('board_user');
    }
};
