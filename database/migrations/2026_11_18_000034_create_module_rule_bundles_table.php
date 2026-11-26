<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('module_rule_bundles', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->restrictOnDelete();
            $table->string('module');
            $table->string('version');
            $table->string('digest', 64);
            $table->string('approver_type', 16);
            $table->string('approver_id');
            $table->timestampTz('approved_at');

            $table->unique(['project_id', 'module', 'version', 'digest']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_rule_bundles');
    }
};
