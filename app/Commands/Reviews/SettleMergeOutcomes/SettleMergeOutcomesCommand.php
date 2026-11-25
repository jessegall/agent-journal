<?php

declare(strict_types=1);

namespace App\Commands\Reviews\SettleMergeOutcomes;

use App\Attributes\Entry;
use App\Attributes\RepeatableRead;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Settles the ended merge attempts supervision has not settled yet, a few on each engine pass.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class SettleMergeOutcomesCommand extends Command
{
    /**
     * The maintenance capability the engine grants for settling merges.
     */
    public const string MAINTENANCE_SCOPE = 'supervision.merges';
}
