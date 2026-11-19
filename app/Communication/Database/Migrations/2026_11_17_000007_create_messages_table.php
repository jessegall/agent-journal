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
        Schema::create('messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->text('body');
            $table->string('state', 32)->default('sent');
            $table->unsignedInteger('answer_round')->default(0);
            $table->ulid('agent_id')->nullable();
            $table->ulid('session_id')->nullable();
            $table->timestampsTz();

            $table->unique(['number_group_id', 'number']);

            $table->index(['agent_id', 'session_id']);
        });

        DB::statement('ALTER TABLE messages ADD CONSTRAINT messages_number_positive CHECK (number > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
