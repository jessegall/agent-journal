<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * A stop is now refused with the same deny every hook takes, so stored hook calls that recorded the old prevent_stop
 * answer read as deny.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement("UPDATE hook_calls SET answer = replace(answer::text, '\"prevent_stop\"', '\"deny\"')::jsonb, steps = replace(steps::text, '\"prevent_stop\"', '\"deny\"')::jsonb WHERE answer::text LIKE '%\"prevent_stop\"%' OR steps::text LIKE '%\"prevent_stop\"%'");
    }

    public function down(): void
    {
        // A deny cannot be told apart from a former prevent_stop, so the rename stays.
    }
};
