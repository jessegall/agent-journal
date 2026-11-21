<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A version 2 sample also names the binding and checkout it read and the verified HEAD, or why there is none.
        Schema::table('workspace_reads', function (Blueprint $table) {
            $table->unsignedSmallInteger('observation_version')->default(1);
            $table->string('binding_id')->default('');
            $table->string('checkout_id')->default('');
            $table->string('head_oid')->default('');
            $table->string('unavailable_reason')->default('');
        });
    }

    public function down(): void
    {
        Schema::table('workspace_reads', function (Blueprint $table) {
            $table->dropColumn(['observation_version', 'binding_id', 'checkout_id', 'head_oid', 'unavailable_reason']);
        });
    }
};
