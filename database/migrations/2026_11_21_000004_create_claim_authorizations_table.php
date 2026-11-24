<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claim_authorizations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('claim_assignment_id')->unique();
            $table->string('basis_type', 16);
            $table->foreignUlid('inbox_member_id')->nullable()->index()->constrained('inbox_members')->cascadeOnDelete();
            $table->ulid('work_assignment_id')->index();
            $table->timestampsTz();
        });

        DB::statement(<<<'SQL'
            ALTER TABLE claim_authorizations ADD CONSTRAINT claim_authorizations_shape CHECK (
                (basis_type = 'inbox-run' AND inbox_member_id IS NOT NULL)
                OR (basis_type = 'direct-run' AND inbox_member_id IS NULL)
            )
            SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('claim_authorizations');
    }
};
