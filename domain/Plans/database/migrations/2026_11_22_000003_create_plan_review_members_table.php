<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_review_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('edition_id')->constrained('plan_review_editions')->cascadeOnDelete();
            $table->unsignedInteger('phase_position');
            $table->unsignedInteger('position');
            $table->ulid('task_id');
            $table->unsignedBigInteger('task_number');
            $table->unsignedInteger('task_revision');
            $table->string('title');
            $table->text('brief');

            $table->index(['edition_id', 'phase_position', 'position', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_review_members');
    }
};
