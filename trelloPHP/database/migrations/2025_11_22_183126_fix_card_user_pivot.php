<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::table('card_user', function (Blueprint $table) {

            // === 1) Xóa foreign key nếu có ===
            try { $table->dropForeign(['card_id']); } catch (\Exception $e) {}
            try { $table->dropForeign(['user_id']); } catch (\Exception $e) {}

            // === 2) Xóa unique/card_id_user_id nếu có ===
            try { $table->dropUnique(['card_id', 'user_id']); } catch (\Exception $e) {}

            // === 3) Xóa primary cũ (trên id) ===
            try { $table->dropPrimary(); } catch (\Exception $e) {}

            // === 4) Xóa cột id lỗi ===
            if (Schema::hasColumn('card_user', 'id')) {
                $table->dropColumn('id');
            }

            // === 5) Tạo composite primary key đúng chuẩn pivot ===
            $table->primary(['card_id', 'user_id']);

            // === 6) Tạo lại foreign key ===
            $table->foreign('card_id')->references('id')->on('cards')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('card_user', function (Blueprint $table) {

            // rollback composite PK
            $table->dropPrimary(['card_id', 'user_id']);

            // thêm lại id
            $table->string('id', 24)->primary();

        });
    }
};
