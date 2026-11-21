<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A shell user's short-lived grant to run journal verbs for one binding, approved by the owner in the browser.
        // Only digests of the device code and the grant are kept.
        Schema::create('device_grants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('binding_id')->constrained('project_bindings');
            $table->char('device_code_digest', 64)->unique();
            $table->string('user_code')->unique();
            $table->jsonb('scopes');
            $table->string('state');
            $table->string('approved_by_user_id')->nullable();
            $table->timestampTz('code_expires_at');
            $table->char('grant_digest', 64)->nullable()->unique();
            $table->timestampTz('grant_expires_at')->nullable();
            $table->timestampTz('last_polled_at')->nullable();
            $table->timestampsTz();
            $table->string('reference')->nullable()->unique();
            $table->unsignedInteger('generation')->default(1);
            $table->string('start_key')->nullable();
            $table->foreignUlid('environment_id')->nullable();
            $table->unique(['binding_id', 'start_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_grants');
    }
};
