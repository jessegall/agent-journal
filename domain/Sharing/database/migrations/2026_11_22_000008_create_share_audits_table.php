<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('share_audits', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('share_id')->nullable()->constrained('shares')->restrictOnDelete();
            $table->string('type');
            $table->string('actor_type');
            $table->string('actor_id');
            $table->string('reason_code')->nullable();
            $table->timestampTz('created_at');

            $table->index([
                'share_id',
                'type',
                'created_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('share_audits');
    }
};
