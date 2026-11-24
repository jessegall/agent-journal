<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Moves a database migrated before nine create migrations were edited to the shape they now create; a database those
 * migrations created afresh already has it, so each step looks first.
 */
return new class extends Migration
{
    /**
     * Each renamed column, by table, from its earlier name to the one the create migration gives it.
     */
    private const array RENAMED = [
        'agent_runtimes' => ['mode' => 'driver_type'],
        'agents' => ['mode_preference' => 'driver_type_preference'],
        'driver_switches' => ['mode' => 'driver_type'],
        'start_records' => ['mode' => 'driver_type'],
        'profile_revisions' => ['driver' => 'preferred_driver'],
    ];

    /**
     * Each column no create migration makes any more, by table.
     */
    private const array DROPPED = [
        'agent_runtimes' => ['pending_work_generation'],
        'driver_switches' => ['mode_intent'],
        'start_records' => ['mode_intent', 'reply_inbox_id'],
        'task_runs' => ['reply_inbox_id'],
        'worktree_deliveries' => ['conflict_paths', 'resulting_target_oid', 'tip_is_reachable'],
        'profile_revisions' => ['allowed_models', 'driver_pinned', 'model'],
    ];

    /**
     * The tier each model a profile revision named stands at, the cheapest first.
     */
    private const array MODEL_TIERS = [
        'haiku' => 1, 'gpt-6-luna' => 1,
        'sonnet' => 2, 'gpt-6.1-terra' => 2,
        'opus' => 3, 'gpt-6.2-sol' => 3,
        'fable' => 4, 'gpt-6.2-astra' => 4,
    ];

    public function up(): void
    {
        foreach (self::RENAMED as $table => $columns) {
            foreach ($columns as $from => $to) {
                if (Schema::hasColumn($table, $from) && ! Schema::hasColumn($table, $to)) {
                    Schema::table($table, fn (Blueprint $blueprint) => $blueprint->renameColumn($from, $to));
                }
            }
        }

        $this->addPreferredTier();

        if (! Schema::hasColumn('driver_requests', 'offer_after')) {
            Schema::table('driver_requests', fn (Blueprint $table) => $table->timestampTz('offer_after')->nullable());
        }

        foreach (self::DROPPED as $table => $columns) {
            $present = array_values(array_filter($columns, fn (string $column) => Schema::hasColumn($table, $column)));

            if ($present !== []) {
                Schema::table($table, fn (Blueprint $blueprint) => $blueprint->dropColumn($present));
            }
        }
    }

    /**
     * Gives each profile revision the tier of the model it named, the general one for a model no tier lists.
     */
    private function addPreferredTier(): void
    {
        if (Schema::hasColumn('profile_revisions', 'preferred_tier')) {
            return;
        }

        Schema::table(
            'profile_revisions',
            fn (Blueprint $table) => $table->unsignedTinyInteger('preferred_tier')->default(2),
        );

        foreach (self::MODEL_TIERS as $model => $tier) {
            DB::table('profile_revisions')->where('model', $model)->update(['preferred_tier' => $tier]);
        }

        DB::statement('alter table profile_revisions alter column preferred_tier drop default');
    }
};
