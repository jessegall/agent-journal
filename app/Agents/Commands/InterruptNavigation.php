<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\InterruptNavigationHandler;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host's report that the person typed, or that it restarted, while a navigation request of its runtime was open:
 * the request is interrupted and its key script waits for the person. The same report twice changes nothing. Run for
 * an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[HandledBy(InterruptNavigationHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class InterruptNavigation extends Command
{
    public function __construct(
        public string $hostId,
        public string $navigationId,
    ) {}
}
