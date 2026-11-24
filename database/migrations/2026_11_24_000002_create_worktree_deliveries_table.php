<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One child's broker-verified commit submitted for integration, apart from any message, and the merger's
        // separate result: the target it reached, or the conflict with its paths and both commit ids.
        Schema::create('worktree_deliveries', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('delivery_id')->unique();
            $table->foreignUlid('binding_id')->constrained('project_bindings');
            $table->foreignUlid('child_claim_id')->constrained('child_claims');
            $table->unsignedInteger('runtime_generation');
            $table->string('checkout');
            $table->string('base_oid', 64);
            $table->string('delivered_tip', 64);
            $table->string('target_ref');
            $table->string('expected_target_oid', 64);
            $table->string('outcome')->default('submitted');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worktree_deliveries');
    }
};
