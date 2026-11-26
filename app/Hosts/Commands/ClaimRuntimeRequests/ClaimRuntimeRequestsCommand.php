<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ClaimRuntimeRequests;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\ClaimedRequests;
use App\Support\Command;

/**
 * A worker takes the pending requests of the runtime its process runs; a worker that was replaced is refused. Run by a driver worker (internal, not exported).
 *
 * @extends Command<ClaimedRequests>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class ClaimRuntimeRequestsCommand extends Command
{
    public function __construct(
        public string $processId,
        public int $workerGeneration,
        public int $limit,
    ) {}
}
