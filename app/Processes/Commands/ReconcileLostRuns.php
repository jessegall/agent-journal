<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Enums\CommandEntry;
use App\Processes\Handlers\ReconcileLostRunsHandler;

/**
 * The journal marks the runs whose supervisor fell silent as lost.
 *
 * @extends Command<int>
 */
#[HandledBy(ReconcileLostRunsHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ReconcileLostRuns extends Command {}
