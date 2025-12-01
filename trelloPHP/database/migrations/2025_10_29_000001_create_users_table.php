<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Traits\HasHexId;


return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->string('id', 24)->primary();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('username');
            $table->string('display_name');
            $table->string('avatar')->nullable();
            $table->enum('role', ['client', 'admin'])->default('client');
            $table->boolean('is_active')->default(false);
            $table->string('verify_token')->nullable();
            $table->timestamp('token_link_expiration')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['role', 'is_active']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('users');
    }
};
