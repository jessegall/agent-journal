<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shares', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('state');
            $table->string('root_type');
            $table->string('root_id');
            $table->string('owner_user_id')->nullable();
            $table->string('requesting_agent_id')->nullable();
            $table->string('requesting_session_id')->nullable();
            $table->foreignUlid('share_gateway_configuration_id')->nullable()->constrained('share_gateway_configurations')->restrictOnDelete();
            $table->unsignedInteger('configuration_version')->nullable();
            $table->unsignedInteger('scope_version')->default(0);
            $table->char('token_digest', 64)->nullable()->unique();
            $table->text('token_ciphertext')->nullable();
            $table->timestampTz('expires_at');
            $table->timestampTz('terminal_at')->nullable();
            $table->unsignedBigInteger('pruned_allowed_reads')->default(0);
            $table->unsignedBigInteger('pruned_denied_reads')->default(0);
            $table->unsignedBigInteger('pruned_lifecycle_rows')->default(0);
            $table->timestampTz('last_pruned_at')->nullable();
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);
            $table->index(['state', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shares');
    }
};
