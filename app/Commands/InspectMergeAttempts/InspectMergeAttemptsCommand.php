<?php

declare(strict_types=1);

namespace App\Commands\InspectMergeAttempts;

use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Ends the merge attempts a run left behind by what git shows, a few on each engine pass, and tells supervision how
 * each ended.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class InspectMergeAttemptsCommand extends Command
{
    /**
     * The maintenance capability the engine grants for inspecting merges.
     */
    public const string MAINTENANCE_SCOPE = 'agents.merges';
}
