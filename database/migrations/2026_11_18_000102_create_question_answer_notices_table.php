<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_answer_notices', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('question_id')->unique()->constrained('questions')->cascadeOnDelete();
            $table->string('agent_id', 64);
            $table->timestampTz('delivered_at')->nullable();
            $table->timestampsTz();

            $table->index(['agent_id', 'delivered_at', 'id']);
        });
    }
};
