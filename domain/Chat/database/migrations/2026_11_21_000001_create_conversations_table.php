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
        Schema::create('conversations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->unique()->constrained('inboxes')->restrictOnDelete();
            $table->string('provider_id')->unique();
            $table->string('title')->nullable();
            $table->string('owner_type', 16)->nullable();
            $table->string('owner_id', 64)->nullable();
            $table->string('environment_id')->nullable()->index();
            $table->string('state', 16);
            $table->timestampTz('closed_at')->nullable();
            $table->boolean('reconcile_pending')->default(false);
            $table->timestampsTz();
        });

        DB::statement(<<<'SQL'
            ALTER TABLE conversations ADD CONSTRAINT conversations_open_has_owner CHECK (
                state <> 'open' OR (owner_type IS NOT NULL AND owner_id IS NOT NULL)
            )
            SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
