<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('driver_image_recipes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            // A recipe row never changes: its digest names its exact inputs.
            $table->char('recipe_digest', 64)->unique();
            $table->string('folder');
            $table->string('base_image');
            $table->string('version', 32);
            // The canonical tar the host builds from, base64, so its bytes come back exactly as they were kept.
            $table->text('context');
            $table->timestampTz('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_image_recipes');
    }
};
