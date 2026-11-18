<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('module_notes', function (Blueprint $table) {
            $table->ulid('agent_id')->index();
        });
    }

    public function down(): void
    {
        Schema::table('module_notes', function (Blueprint $table) {
            $table->dropColumn('agent_id');
        });
    }
};
