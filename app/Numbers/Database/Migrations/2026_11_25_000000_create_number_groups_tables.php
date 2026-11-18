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
        Schema::create('global_groups', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('number_groups', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->ulidMorphs('holder');
            $table->string('record_type');
            $table->bigInteger('last_number')->default(0);
            $table->timestamp('retired_at')->nullable();
            $table->timestamps();

            $table->unique(['holder_type', 'holder_id', 'record_type']);
        });

        DB::statement('ALTER TABLE number_groups ADD CONSTRAINT number_groups_last_number_not_negative CHECK (last_number >= 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('number_groups');
        Schema::dropIfExists('global_groups');
    }
};
