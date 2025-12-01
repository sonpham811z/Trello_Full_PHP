<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cards', function (Blueprint $table) {

            // PRIMARY KEY kiểu ObjectId 24 hex
            $table->string('id', 24)->primary();

            // Board + Column ID đều là string(24)
            $table->string('board_id', 24);
            $table->string('column_id', 24);

            $table->string('title', 100);
            $table->text('description')->nullable();

            $table->string('cover')->nullable();

            // Không còn position nữa → FE dùng card_order_ids
            // $table->unsignedInteger('position')->default(0);

            $table->json('comments')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('board_id')
                  ->references('id')->on('boards')
                  ->cascadeOnDelete();

            $table->foreign('column_id')
                  ->references('id')->on('board_columns')
                  ->cascadeOnDelete();

            // Index
            $table->index(['board_id', 'column_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('cards');
    }
};
