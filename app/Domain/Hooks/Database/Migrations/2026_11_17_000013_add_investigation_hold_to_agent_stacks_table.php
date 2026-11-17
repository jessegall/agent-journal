<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agent_stacks', function (Blueprint $table) {
            $table->timestampTz('held_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('agent_stacks', function (Blueprint $table) {
            $table->dropColumn('held_at');
        });
    }
};
