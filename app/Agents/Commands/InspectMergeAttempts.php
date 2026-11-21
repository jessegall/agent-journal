<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Ends the merge attempts a run left behind by what git shows, a few on each engine pass, and tells supervision how
 * each ended.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class InspectMergeAttempts extends Command
{
    /**
     * The maintenance capability the engine grants for inspecting merges.
     */
    public const string MAINTENANCE_SCOPE = 'agents.merges';
}
