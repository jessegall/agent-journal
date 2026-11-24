<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The route whose calls fail, so only an answer on that route ends a host's failing link.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hosts', fn (Blueprint $table) => $table->string('failing_route')->nullable());
    }

    public function down(): void
    {
        Schema::table('hosts', fn (Blueprint $table) => $table->dropColumn('failing_route'));
    }
};
