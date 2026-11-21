<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The project each connection step was for, beside its binding, so the support record names both.
        Schema::table('connection_audits', function (Blueprint $table): void {
            $table->string('project_id')->nullable();
        });

        DB::statement('UPDATE connection_audits SET project_id = (SELECT project_id FROM project_bindings '
            .'WHERE project_bindings.id = connection_audits.binding_id) WHERE binding_id IS NOT NULL');
    }

    public function down(): void
    {
        Schema::table('connection_audits', function (Blueprint $table): void {
            $table->dropColumn('project_id');
        });
    }
};
