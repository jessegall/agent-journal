<?php

declare(strict_types=1);

namespace App\Agents\Commands\ProbeClaimedStart;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Probes a claimed start once its driver image may run it: a contained start waits for its host's image, freezes it
 * on the session when ready and probes in it, or ends refused with it. Run by the journal itself after the claim and
 * when an image the start waits on settles (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ProbeClaimedStartCommand extends Command
{
    public function __construct(public string $startId) {}
}
