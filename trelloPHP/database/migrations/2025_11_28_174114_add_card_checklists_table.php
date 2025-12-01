<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('card_checklists', function (Blueprint $table) {
        $table->string('id', 24)->primary();
        $table->string('card_id', 24);
        $table->string('title', 255);
        $table->timestamps();

        $table->foreign('card_id')->references('id')->on('cards')->cascadeOnDelete();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
