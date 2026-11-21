<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('command_receipts', function (Blueprint $table) {
            // What a command that names its target wrote to, so a lookup by key checks it before it tells anything.
            $table->string('target', 160)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('command_receipts', function (Blueprint $table) {
            $table->dropColumn('target');
        });
    }
};
