<?php

declare(strict_types=1);

namespace App\Commands\Drivers\ClaimDriverRequests;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\ClaimedRequests;
use App\Support\Command;
use App\Values\BrowserInputCapabilities;

/**
 * Hands a host the next accepted requests of its runtimes, at most a batch, taking turns between runtimes. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedRequests>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimDriverRequestsCommand extends Command
{
    public function __construct(
        public string $hostId,
        public int $limit,
        // Which browser input the host says it carries out on its terminals; one that says none is watch-only.
        public BrowserInputCapabilities $browserInput,
    ) {}
}
