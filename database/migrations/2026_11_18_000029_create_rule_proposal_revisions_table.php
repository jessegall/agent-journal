<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rule_proposal_revisions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('rule_proposal_id')->constrained('rule_proposals')->cascadeOnDelete();
            $table->unsignedInteger('revision');
            $table->jsonb('payload');
            $table->text('evidence');
            $table->jsonb('examples');
            $table->string('author_type', 16);
            $table->string('author_id');
            $table->timestampTz('created_at');

            $table->unique(['rule_proposal_id', 'revision']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rule_proposal_revisions');
    }
};
