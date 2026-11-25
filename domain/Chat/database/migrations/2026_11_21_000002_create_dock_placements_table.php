<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dock_placements', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('inbox_id')->constrained('inboxes')->cascadeOnDelete();
            $table->string('dockable_type', 64);
            $table->string('dockable_id');
            $table->string('presentation', 64)->default('default');
            $table->string('assigned_by_type', 16);
            $table->string('assigned_by_id');
            $table->timestampTz('assigned_at');
            $table->timestampsTz();

            $table->unique([
                'inbox_id',
                'dockable_type',
                'dockable_id',
            ]);
            $table->index([
                'dockable_type',
                'dockable_id',
            ]);
            $table->index([
                'inbox_id',
                'assigned_at',
                'id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dock_placements');
    }
};
