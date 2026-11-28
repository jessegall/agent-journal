<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_running_tools', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('agent_id')->unique()->constrained('agents')->cascadeOnDelete();
            $table->string('line', 200)->nullable();
            $table->boolean('is_running');
            $table->timestampTz('changed_at', 6);
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_running_tools');
    }
};
