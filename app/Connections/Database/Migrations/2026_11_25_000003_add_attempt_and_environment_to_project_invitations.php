<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A line belongs to its owner's install attempt, which holds the owner's key now, and a Join line names the
        // environment it lands in. A line issued before attempts existed names none; it expired long ago.
        Schema::table('project_invitations', function (Blueprint $table): void {
            $table->foreignUlid('install_attempt_id')->nullable()->after('project_id')->constrained('install_attempts');
            $table->foreignUlid('environment_id')->nullable()->after('project_id')
                ->constrained('project_environments')->nullOnDelete();
            $table->dropIndex(['issuance_key']);
            $table->dropColumn('issuance_key');
        });
    }

    public function down(): void
    {
        Schema::table('project_invitations', function (Blueprint $table): void {
            $table->string('issuance_key')->default('')->index();
            $table->dropConstrainedForeignId('environment_id');
            $table->dropConstrainedForeignId('install_attempt_id');
        });
    }
};
