<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A viewer dismissed one version of an agent's launch outcome, the outcome of one start request.
        Schema::create('session_outcome_dismissals', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('viewer_type', 16);
            $table->string('viewer_id', 64);
            $table->ulid('agent_id');
            $table->ulid('request_id');
            $table->string('outcome_version', 16);
            $table->timestampsTz();
            $table->unique(['viewer_type', 'viewer_id', 'request_id', 'outcome_version']);
            $table->index(['viewer_type', 'viewer_id', 'agent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_outcome_dismissals');
    }
};
