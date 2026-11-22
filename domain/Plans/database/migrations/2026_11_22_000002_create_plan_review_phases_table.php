<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_review_phases', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('edition_id')->constrained('plan_review_editions')->cascadeOnDelete();
            $table->unsignedInteger('position');
            $table->ulid('phase_id');
            $table->unsignedBigInteger('phase_number');
            $table->unsignedInteger('phase_revision');
            $table->string('title');

            $table->index(['edition_id', 'position', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_review_phases');
    }
};
