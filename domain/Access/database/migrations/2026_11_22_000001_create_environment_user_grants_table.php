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
        Schema::create('environment_user_grants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('environment_key');
            $table->boolean('can_open_inboxes')->default(false);
            $table->boolean('can_manage_members')->default(false);
            $table->boolean('can_receive_invitations')->default(false);
            $table->string('granted_by_type', 16);
            $table->string('granted_by_id', 64);
            $table->timestampTz('granted_at');
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampsTz();

            $table->index(['environment_key', 'revoked_at']);
        });

        DB::statement(<<<'SQL'
            CREATE UNIQUE INDEX environment_user_grants_one_active
                ON environment_user_grants (user_id, environment_key)
                WHERE revoked_at IS NULL
            SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('environment_user_grants');
    }
};
