<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Support\ClaimedRequests;
use App\Agents\Values\BrowserInputCapabilities;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Hands a host the next accepted requests of its runtimes, at most a batch, taking turns between runtimes. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedRequests>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimDriverRequests extends Command
{
    public function __construct(
        public string $hostId,
        public int $limit,
        // Which browser input the host says it carries out on its terminals; one that says none is watch-only.
        public BrowserInputCapabilities $browserInput,
    ) {}
}
