<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_review_editions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->unsignedInteger('number');
            $table->string('requested_by_type', 16);
            $table->string('requested_by_id', 64);
            $table->unsignedInteger('plan_revision');
            $table->string('status', 24);
            $table->string('decided_by_type', 16)->nullable();
            $table->string('decided_by_id', 64)->nullable();
            $table->timestampTz('decided_at')->nullable();
            $table->text('decision_reason')->nullable();
            $table->string('decision_request_key', 200)->nullable();
            $table->boolean('is_historical')->default(false);
            $table->timestampsTz();

            $table->unique([
                'plan_id',
                'number',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_review_editions');
    }
};
