<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sign_in_attempts', function (Blueprint $table): void {
            $table->string('refusal', 300)->nullable()->after('cleanup_problem');
        });
    }

    public function down(): void
    {
        Schema::table('sign_in_attempts', function (Blueprint $table): void {
            $table->dropColumn('refusal');
        });
    }
};
