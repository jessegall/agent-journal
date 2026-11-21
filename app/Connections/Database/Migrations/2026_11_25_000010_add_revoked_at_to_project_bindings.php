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
        // When the server took the binding's revocation, which a repeated revoke answers instead of revoking again.
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->timestampTz('revoked_at')->nullable();
        });

        // A binding revoked before this kept no time of it; its last change is the nearest record.
        DB::table('project_bindings')->where('readiness', 'revoked')->update(['revoked_at' => DB::raw('updated_at')]);
    }

    public function down(): void
    {
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->dropColumn('revoked_at');
        });
    }
};
