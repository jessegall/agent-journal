<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_mcp_retained_pages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('agent_id');
            $table->ulid('session_id');
            $table->json('references');
            $table->timestampTz('expires_at')->index();
            $table->timestampsTz();
            $table->index(['agent_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_mcp_retained_pages');
    }
};
