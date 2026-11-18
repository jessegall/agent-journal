<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('share_previews', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('owner_user_id');
            $table->string('root_type');
            $table->string('root_id');
            $table->json('selection');
            $table->foreignUlid('share_gateway_configuration_id')->constrained('share_gateway_configurations')->restrictOnDelete();
            $table->unsignedInteger('configuration_version');
            $table->char('checksum', 64);
            $table->timestampTz('expires_at');
            $table->timestampTz('consumed_at')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('share_previews');
    }
};
