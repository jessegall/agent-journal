<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profile_runs', function (Blueprint $table) {
            $table->unsignedInteger('generation')->nullable();
            $table->unsignedInteger('unchanged_returns')->default(0);
            $table->text('message')->nullable();
            $table->unsignedInteger('sequence')->default(0);
            $table->unique(['actor_type', 'actor_id', 'work', 'sequence']);
        });
    }

    public function down(): void
    {
        Schema::table('profile_runs', function (Blueprint $table) {
            $table->dropUnique(['actor_type', 'actor_id', 'work', 'sequence']);
            $table->dropColumn(['generation', 'unchanged_returns', 'message', 'sequence']);
        });
    }
};
