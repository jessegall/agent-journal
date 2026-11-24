<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * A stored execution policy names whether its sessions may be attached as isAttachable, as the policy reads it; the
 * rows stored as attachable before keep their value under the new key.
 */
return new class extends Migration
{
    private const array TABLES = ['session_policies', 'profile_revisions'];

    public function up(): void
    {
        foreach (self::TABLES as $table) {
            $this->renameKey($table, 'attachable', 'isAttachable');
        }
    }

    public function down(): void
    {
        foreach (self::TABLES as $table) {
            $this->renameKey($table, 'isAttachable', 'attachable');
        }
    }

    private function renameKey(string $table, string $from, string $to): void
    {
        DB::statement(
            "update {$table} set execution_policy = ((execution_policy::jsonb - ?) || jsonb_build_object(?::text, execution_policy::jsonb -> ?))::json where jsonb_exists(execution_policy::jsonb, ?)",
            [$from, $to, $from, $from],
        );
    }
};
