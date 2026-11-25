<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parcels', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('carrier_id')->constrained('carriers');
            $table->string('owner_id')->index();
            $table->timestampTz('delivered_at')->nullable();
            $table->timestampsTz();
        });
    }
};
