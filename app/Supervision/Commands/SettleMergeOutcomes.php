<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Supervision\Handlers\SettleMergeOutcomesHandler;

/**
 * Settles the ended merge attempts supervision has not settled yet, a few on each engine pass.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Entry(CommandEntry::EngineMaintenance)]
#[HandledBy(SettleMergeOutcomesHandler::class)]
final readonly class SettleMergeOutcomes extends Command
{
    /**
     * The maintenance capability the engine grants for settling merges.
     */
    public const string MAINTENANCE_SCOPE = 'supervision.merges';
}
