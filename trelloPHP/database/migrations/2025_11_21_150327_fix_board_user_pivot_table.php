<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::table('board_user', function (Blueprint $table) {

            // 1) Xóa primary key cũ đang đặt trên cột id
            $table->dropPrimary();

            // 2) Xóa luôn cột id (cột này gây lỗi)
            $table->dropColumn('id');

            // 3) Đặt composite primary key đúng chuẩn pivot
            $table->primary(['board_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::table('board_user', function (Blueprint $table) {

            // 1) Xoá composite primary key
            $table->dropPrimary(['board_id', 'user_id']);

            // 2) Tạo lại cột id nếu rollback
            $table->string('id', 24)->primary();

            // ⚠️ Lưu ý: rollback sẽ xoá composite primary key
            // và đưa id trở lại làm primary
        });
    }
};
