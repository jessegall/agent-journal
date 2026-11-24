<?php

declare(strict_types=1);

namespace App\Commands\Navigation\RaiseNavigation;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Support\NavigationRaiseAnswer;
use App\Values\NavigationUncertainty;

/**
 * A host's key script run stopped at a point it could not be certain of: the stalled request and attempt, the step,
 * why, and the stable screen it stopped on, redacted. The operation key names the raise, so a repeated send is the
 * same raise. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<NavigationRaiseAnswer>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RaiseNavigationCommand extends Command
{
    /**
     * @param  list<string>  $declinedEntries
     */
    public function __construct(
        public string $hostId,
        public string $runtimeId,
        public string $operationKey,
        public string $requestId,
        public int $attempt,
        public NavigationUncertainty $uncertainty,
        public array $declinedEntries = [],
    ) {}
}
