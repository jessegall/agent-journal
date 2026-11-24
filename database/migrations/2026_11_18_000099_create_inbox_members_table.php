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
        Schema::create('inbox_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->restrictOnDelete();
            $table->string('actor_type', 16);
            $table->string('actor_id', 64);
            $table->timestampTz('joined_at');
            $table->timestampTz('left_at')->nullable();

            $table->index(['actor_type', 'actor_id', 'left_at']);
        });

        DB::statement(<<<'SQL'
            CREATE UNIQUE INDEX inbox_members_one_active
                ON inbox_members (inbox_id, actor_type, actor_id)
                WHERE left_at IS NULL
            SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('inbox_members');
    }
};
