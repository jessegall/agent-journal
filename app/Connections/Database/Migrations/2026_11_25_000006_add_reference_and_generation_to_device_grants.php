<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A terminal sign-in's nonsecret reference and its generation within the binding, the key its start was sent
        // under, so a lost start reply finds the same grant, and the environment of the binding it was asked for.
        Schema::table('device_grants', function (Blueprint $table): void {
            $table->string('reference')->nullable()->unique();
            $table->unsignedInteger('generation')->default(1);
            $table->string('start_key')->nullable();
            $table->foreignUlid('environment_id')->nullable()->constrained('project_environments')->nullOnDelete();
            $table->unique(['binding_id', 'start_key']);
        });
    }

    public function down(): void
    {
        Schema::table('device_grants', function (Blueprint $table): void {
            $table->dropUnique(['binding_id', 'start_key']);
            $table->dropConstrainedForeignId('environment_id');
            $table->dropColumn(['reference', 'generation', 'start_key']);
        });
    }
};
