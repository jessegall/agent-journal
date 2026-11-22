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
        Schema::table('terminal_views', function (Blueprint $table) {
            $table->string('read_interest_id', 64)->nullable();
            $table->string('open_request_id', 64)->nullable();
        });

        DB::table('terminal_views')->update(['read_interest_id' => DB::raw('id'), 'open_request_id' => DB::raw('id')]);

        Schema::table('terminal_views', function (Blueprint $table) {
            $table->string('read_interest_id', 64)->nullable(false)->change();
            $table->string('open_request_id', 64)->nullable(false)->change();
            $table->unique('read_interest_id');
            $table->unique(['actor_type', 'actor_id', 'open_request_id']);
        });
    }

    public function down(): void
    {
        Schema::table('terminal_views', function (Blueprint $table) {
            $table->dropUnique(['actor_type', 'actor_id', 'open_request_id']);
            $table->dropUnique(['read_interest_id']);
            $table->dropColumn(['read_interest_id', 'open_request_id']);
        });
    }
};
