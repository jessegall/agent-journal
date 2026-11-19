<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\NavigationReason;

/**
 * Where a key script run could not be certain, as the host raised it: why, at which step, and the stable screen it
 * stopped on with that screen's fingerprint, and, after a stale replay, the entry and the steps it already sent.
 */
final readonly class NavigationUncertainty
{
    /**
     * @param  list<string>  $sentSteps  the steps a stale entry's replay already sent before it failed, by name
     */
    public function __construct(
        public NavigationReason $reason,
        public int $stalledStep,
        public string $fingerprint,
        public NavigationScreen $screen,
        public string|null $staleEntryId = null,
        public array $sentSteps = [],
    ) {}
}
