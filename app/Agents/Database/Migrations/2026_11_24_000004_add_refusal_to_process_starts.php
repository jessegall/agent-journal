<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Why the host's claim of the start was refused for good, such as a program that cannot start in a container.
        Schema::table('process_starts', function (Blueprint $table) {
            $table->text('refusal')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('process_starts', function (Blueprint $table) {
            $table->dropColumn('refusal');
        });
    }
};
