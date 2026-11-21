<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The environment a binding works in; none for a binding connected before environments existed, which starts
        // nothing until the owner assigns one.
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->foreignUlid('environment_id')->nullable()->after('project_id')->constrained('project_environments');
        });
    }

    public function down(): void
    {
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('environment_id');
        });
    }
};
