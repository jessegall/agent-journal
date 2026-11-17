<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('launch_credentials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_session_id')->unique();
            $table->char('token_hash', 64)->unique();
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('launch_credentials');
    }
};
