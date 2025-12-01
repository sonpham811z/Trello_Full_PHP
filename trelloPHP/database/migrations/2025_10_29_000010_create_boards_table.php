<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {

        Schema::create('boards', function (Blueprint $table) {

            // PRIMARY KEY kiểu Mongo ObjectId (24 hex string)
            $table->string('id', 24)->primary();

            // FOREIGN KEY cũng phải là string(24)
            $table->string('owner_id', 24);

            $table->string('title', 100);
            $table->string('slug')->unique();
            $table->string('description', 255)->nullable();
            $table->enum('type', ['public', 'private'])->default('private');

            // Laravel cast JSON -> array
            $table->json('column_order_ids')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // foreign key thủ công (ko dùng foreignId)
            $table->foreign('owner_id')
                  ->references('id')->on('users')
                  ->cascadeOnDelete();

            // index
            $table->index(['owner_id', 'type']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('boards');
    }
};
