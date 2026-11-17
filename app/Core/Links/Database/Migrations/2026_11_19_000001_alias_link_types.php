<?php

declare(strict_types=1);

use App\Core\Links\Exceptions\UnknownLinkType;
use App\Core\Links\Support\LinkTypeRenames;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Links store stable names instead of class names. Each domain's own migration renames its models first; this one
 * renames Core's, then stops on any stored type that is still no registered link name, instead of guessing.
 */
return new class extends Migration
{
    public function up(): void
    {
        LinkTypeRenames::rename(DB::connection(), [
            'App\\Core\\Agents\\Models\\Agent' => 'core.agent',
            'App\\Core\\Agents\\Models\\AgentSession' => 'core.agent-session',
            'App\\Core\\Agents\\Models\\LaunchBypass' => 'core.launch-bypass',
            'App\\Core\\Agents\\Models\\LaunchCredential' => 'core.launch-credential',
            'App\\Core\\Hooks\\Models\\AgentStackRow' => 'core.agent-stack',
            'App\\Core\\Hooks\\Models\\HookCall' => 'core.hook-call',
            'App\\Core\\Links\\Models\\Link' => 'core.link',
        ]);

        $stored = DB::table('links')->pluck('source_type')->merge(DB::table('links')->pluck('target_type'))->unique()->values()->all();
        $unknown = array_values(array_diff($stored, array_keys(Relation::morphMap())));

        if ($unknown !== []) {
            throw UnknownLinkType::stored($unknown);
        }
    }
};
