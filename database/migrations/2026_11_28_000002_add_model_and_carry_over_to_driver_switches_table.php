<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('driver_switches', function (Blueprint $table) {
            $table->string('model', 100)->default('default');
            $table->boolean('carries_conversation')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('driver_switches', function (Blueprint $table) {
            $table->dropColumn(['model', 'carries_conversation']);
        });
    }
};
