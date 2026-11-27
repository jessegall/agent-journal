<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RunFenced;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\Values\FencedRun;
use App\Support\Command;

/**
 * Instructs the host to close admission for the processes of the fence, refuse while one of them other than those
 * waiting still runs, and run each driver in turn within the budget; the instruction's answer carries each result. Run
 * by the journal itself (internal, not exported).
 *
 * @extends Command<string>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RunFencedCommand extends Command
{
    /**
     * @param  list<string>  $waiting  the processes of the fence that wait on the run, such as the agent at its stop
     * @param  list<FencedRun>  $runs
     */
    public function __construct(
        public string $hostId,
        public string $fence,
        public array $waiting,
        public array $runs,
        public int $budgetMs,
    ) {}
}
