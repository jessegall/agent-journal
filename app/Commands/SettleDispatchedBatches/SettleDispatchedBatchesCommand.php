<?php

declare(strict_types=1);

namespace App\Commands\SettleDispatchedBatches;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Settles the message batches a driver was handed whose turn is over, a few on each engine pass.
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class SettleDispatchedBatchesCommand extends Command
{
    /**
     * The maintenance capability the engine grants for this sweep.
     */
    public const string MAINTENANCE_SCOPE = 'communication.batches';
}
