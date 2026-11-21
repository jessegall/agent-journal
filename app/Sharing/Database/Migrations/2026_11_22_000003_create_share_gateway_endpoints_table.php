<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('share_gateway_endpoints', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('share_gateway_configuration_id')
                ->constrained('share_gateway_configurations')
                ->restrictOnDelete();

            $table->unsignedInteger('endpoint_version');
            $table->string('run_id');
            $table->string('public_origin');
            $table->string('state');
            $table->timestampTz('last_health_at')->nullable();
            $table->timestampsTz();

            $table->unique(['share_gateway_configuration_id', 'endpoint_version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('share_gateway_endpoints');
    }
};
