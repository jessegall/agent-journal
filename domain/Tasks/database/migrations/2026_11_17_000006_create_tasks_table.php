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
        Schema::create('tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->text('brief');
            $table->string('creator_type', 16);
            $table->string('creator_id', 64);
            $table->unsignedInteger('revision')->default(1);
            $table->string('status', 16)->default('open');
            $table->unsignedInteger('run_number')->default(0);
            $table->text('result_note')->nullable();
            $table->text('block_reason')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->timestampsTz();

            $table->unique([
                'number_group_id',
                'number',
            ]);

            // The environment of the connected binding a task was made through, by id alone; none for a task made here.
            $table->string('environment_id')->nullable()->index();
        });

        DB::statement('ALTER TABLE tasks ADD CONSTRAINT tasks_number_positive CHECK (number > 0)');

        // Search narrows each title tier and the brief tier through trigram indexes, so a miss or a rare late hit
        // is found without walking every task.
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE INDEX tasks_title_search ON tasks USING gin (title gin_trgm_ops)');
        DB::statement('CREATE INDEX tasks_brief_search ON tasks USING gin (brief gin_trgm_ops)');
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
