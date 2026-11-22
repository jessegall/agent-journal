<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('share_gateway_operations', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUlid('share_gateway_configuration_id')
                ->constrained('share_gateway_configurations')
                ->restrictOnDelete();

            $table->unsignedInteger('configuration_version');

            $table->foreignUlid('share_gateway_endpoint_id')
                ->nullable()
                ->constrained('share_gateway_endpoints')
                ->restrictOnDelete();

            $table->unsignedInteger('endpoint_version')->nullable();
            $table->string('type');
            $table->string('run_id')->nullable();
            $table->string('lease_token', 64)->nullable();
            $table->timestampTz('lease_ends_at')->nullable();
            $table->string('outcome_code')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('share_gateway_operations');
    }
};
