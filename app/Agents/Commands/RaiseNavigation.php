<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\NavigationReason;
use App\Agents\Handlers\RaiseNavigationHandler;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * A host's key script run stopped at a point it could not be certain of: the stalled request and attempt, the step,
 * why, and the stable screen it stopped on, redacted. The operation key names the raise, so a repeated send is the
 * same raise. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<NavigationRaiseAnswer>
 */
#[HandledBy(RaiseNavigationHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class RaiseNavigation extends Command
{
    /**
     * @param  list<string>  $rows
     * @param  list<string>  $declinedEntries
     */
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public string $operationKey,
        public string $requestId,
        public int $attempt,
        public int $step,
        public NavigationReason $reason,
        public string $fingerprint,
        public array $rows,
        public int $highlight,
        public int $generation,
        public array $declinedEntries = [],
    ) {}
}
