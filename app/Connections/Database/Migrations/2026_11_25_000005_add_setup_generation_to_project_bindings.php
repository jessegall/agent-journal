<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The setup generation of the folder the binding's relay last reported; a report of an older setup is stale.
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->unsignedInteger('setup_generation')->default(0)->after('boot_generation');
        });
    }

    public function down(): void
    {
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->dropColumn('setup_generation');
        });
    }
};
