<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimRuntimeRequests;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\ClaimedRequests;
use App\Support\Command;

/**
 * A worker takes the pending requests of the runtime its process runs; a worker that was replaced is refused. Run by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedRequests>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimRuntimeRequestsCommand extends Command
{
    public function __construct(
        public string $processId,
        public int $workerGeneration,
        public int $limit,
    ) {}
}
