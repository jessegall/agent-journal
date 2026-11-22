<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_changes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('scope_id')->constrained('notification_scopes')->cascadeOnDelete();
            $table->unsignedBigInteger('version');
            $table->ulid('receipt_id');
            $table->string('mutation_type', 8);
            $table->unsignedBigInteger('sequence');
            $table->timestampTz('created_at')->nullable();

            $table->unique(['scope_id', 'version']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_changes');
    }
};
