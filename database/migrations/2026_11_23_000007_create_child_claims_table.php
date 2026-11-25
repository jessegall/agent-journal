<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One child the journal dispatches for a connected parent: who dispatched it, in which generation, with which
        // role, for which binding, from which verified commit, and the chain of claims above it.
        Schema::create('child_claims', function (Blueprint $table) {
            $table->ulid('id');
            $table->primary('id');
            $table->string('parent_runtime_id');
            $table->unsignedInteger('parent_generation');
            $table->string('child_agent_id');
            $table->string('role');
            $table->foreignUlid('binding_id')->constrained('project_bindings');
            $table->string('base_oid', 64);
            $table->boolean('parent_was_dirty');
            $table->ulid('parent_claim_id')->nullable();
            $table->foreign('parent_claim_id')->references('id')->on('child_claims');
            $table->string('root_runtime_id');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_claims');
    }
};
