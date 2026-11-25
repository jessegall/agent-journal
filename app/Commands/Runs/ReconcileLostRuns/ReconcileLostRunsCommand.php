<?php

declare(strict_types=1);

namespace App\Commands\Runs\ReconcileLostRuns;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * The journal marks the runs whose supervisor fell silent as lost.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReconcileLostRunsCommand extends Command {}
