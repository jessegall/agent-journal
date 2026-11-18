<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('share_gateway_configurations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('gateway_key');
            $table->unsignedInteger('configuration_version');
            $table->json('settings');
            $table->boolean('is_default')->default(false);
            $table->timestampTz('disabled_at')->nullable();
            $table->timestampsTz();

            $table->unique(['gateway_key', 'configuration_version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('share_gateway_configurations');
    }
};
