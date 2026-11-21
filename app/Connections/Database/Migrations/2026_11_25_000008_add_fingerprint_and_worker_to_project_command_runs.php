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
        // Each run binds its request id to one operation by a digest of its arguments, piped input, binding and agent,
        // and names the server worker that runs it, so a run whose worker is gone is settled from evidence.
        Schema::table('project_command_runs', function (Blueprint $table): void {
            $table->string('fingerprint', 64)->default('');
            $table->string('worker')->default('');
        });

        // A finished run is completed when it exited 0 and failed otherwise.
        DB::table('project_command_runs')->where('state', 'finished')->where('exit_code', 0)
            ->update(['state' => 'completed']);

        DB::table('project_command_runs')->where('state', 'finished')->update(['state' => 'failed']);
    }

    public function down(): void
    {
        DB::table('project_command_runs')->whereIn('state', ['completed', 'failed'])->update(['state' => 'finished']);

        Schema::table('project_command_runs', function (Blueprint $table): void {
            $table->dropColumn(['fingerprint', 'worker']);
        });
    }
};
