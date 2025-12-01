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
        Schema::create('checklist_items', function (Blueprint $table) {
            $table->string('id', 24)->primary();
            $table->string('checklist_id', 24);
            $table->string('text', 255);
            $table->boolean('is_done')->default(false);
            $table->timestamps();

            $table->foreign('checklist_id')->references('id')->on('card_checklists')->cascadeOnDelete();
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
