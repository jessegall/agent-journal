<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_chat_permissions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('agent_id')->constrained('agents')->cascadeOnDelete();
            $table->string('environment_key');
            $table->boolean('allows_participation')->default(false);
            $table->string('granted_by_type', 16);
            $table->string('granted_by_id', 64);
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampsTz();
        });

        DB::statement(<<<'SQL'
            CREATE UNIQUE INDEX agent_chat_permissions_one_active
                ON agent_chat_permissions (agent_id, environment_key)
                WHERE revoked_at IS NULL
            SQL);

        Schema::create('agent_chat_inviters', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('permission_id')->constrained('agent_chat_permissions')->cascadeOnDelete();
            $table->string('user_id', 64);
            $table->timestampsTz();

            $table->unique(['permission_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_chat_inviters');
        Schema::dropIfExists('agent_chat_permissions');
    }
};
