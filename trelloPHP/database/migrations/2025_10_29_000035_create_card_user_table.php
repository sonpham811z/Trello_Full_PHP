<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('card_user', function (Blueprint $table) {

            $table->string('id', 24)->primary();

            $table->string('card_id', 24);
            $table->string('user_id', 24);

            $table->timestamps();

            $table->foreign('card_id')
                  ->references('id')->on('cards')
                  ->cascadeOnDelete();

            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->cascadeOnDelete();

            $table->unique(['card_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('card_user');
    }
};
