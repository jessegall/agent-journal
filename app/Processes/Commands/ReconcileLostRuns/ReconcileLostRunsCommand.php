<?php

declare(strict_types=1);

namespace App\Processes\Commands\ReconcileLostRuns;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * The journal marks the runs whose supervisor fell silent as lost.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReconcileLostRunsCommand extends Command {}
