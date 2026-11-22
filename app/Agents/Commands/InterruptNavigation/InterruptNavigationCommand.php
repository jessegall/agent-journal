<?php

declare(strict_types=1);

namespace App\Agents\Commands\InterruptNavigation;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host's report that the user typed, or that it restarted, while a navigation request of its runtime was open:
 * the request is interrupted and its key script waits for the user. The same report twice changes nothing. Run for
 * an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class InterruptNavigationCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $navigationId,
    ) {}
}
