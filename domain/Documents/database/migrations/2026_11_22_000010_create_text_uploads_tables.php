<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('text_uploads', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->index()->constrained('projects')->restrictOnDelete();
            $table->string('type', 32);
            $table->unsignedInteger('bytes');
            $table->char('digest', 64);
            $table->unsignedInteger('received_bytes')->default(0);
            $table->unsignedInteger('next_index')->default(0);
            $table->timestampTz('expires_at')->index();
            $table->timestampTz('sealed_at')->nullable();
            $table->timestampTz('consumed_at')->nullable();
            $table->timestampsTz();
        });

        Schema::create('text_upload_chunks', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('upload_id')->constrained('text_uploads')->cascadeOnDelete();
            $table->unsignedInteger('position');
            $table->text('encoded_text');
            $table->timestampsTz();

            $table->unique(['upload_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('text_upload_chunks');
        Schema::dropIfExists('text_uploads');
    }
};
