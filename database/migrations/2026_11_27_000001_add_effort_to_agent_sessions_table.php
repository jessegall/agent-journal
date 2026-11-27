<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * The effort a session was started at, resolved with its model: a session started before every start carried one
 * gets the medium effort it ran closest to.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agent_sessions', function (Blueprint $table): void {
            $table->string('effort', 32)->nullable()->after('model');
        });

        DB::table('agent_sessions')->whereNull('effort')->update(['effort' => 'medium']);

        Schema::table('agent_sessions', function (Blueprint $table): void {
            $table->string('effort', 32)->nullable(false)->change();
        });
    }
};
