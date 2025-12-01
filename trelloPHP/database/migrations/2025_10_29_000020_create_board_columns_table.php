<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('board_columns', function (Blueprint $table) {

            // PRIMARY KEY kiểu ObjectId 24 hex
            $table->string('id', 24)->primary();

            // BOARD ID cũng phải là string(24)
            $table->string('board_id', 24);

            $table->string('title', 100);
            $table->json('card_order_ids')->nullable();
            $table->string('description', 255)->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Foreign key (không dùng foreignId)
            $table->foreign('board_id')
                  ->references('id')->on('boards')
                  ->cascadeOnDelete();

            // Index
            $table->index(['board_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('board_columns');
    }
};
