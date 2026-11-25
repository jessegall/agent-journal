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
        Schema::create('rules', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->text('text');
            $table->string('status', 16)->default('active');
            $table->text('reason')->nullable();
            $table->ulid('replaces_rule_id')->nullable();
            $table->string('proposer_type', 16)->nullable();
            $table->string('proposer_id', 64)->nullable();
            $table->timestampsTz();

            $table->unique([
                'number_group_id',
                'number',
            ]);
        });

        DB::statement('ALTER TABLE rules ADD CONSTRAINT rules_number_positive CHECK (number > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('rules');
    }
};
