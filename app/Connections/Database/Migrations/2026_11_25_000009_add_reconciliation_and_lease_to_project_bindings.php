<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The boot whose relay reported it reconciled its earlier sessions, so starts and commands wait for it; and the
        // runtime that holds the binding's lease with when it ends, until its device confirms the session stopped.
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->string('reconciled_boot_id')->nullable();
            $table->string('leased_runtime_id')->nullable();
            $table->timestampTz('lease_expires_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('project_bindings', function (Blueprint $table): void {
            $table->dropColumn(['reconciled_boot_id', 'leased_runtime_id', 'lease_expires_at']);
        });
    }
};
