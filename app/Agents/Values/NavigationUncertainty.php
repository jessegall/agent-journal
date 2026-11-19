<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\NavigationReason;

/**
 * Where a key script run could not be certain, as the host raised it: why, at which step, and the stable screen it
 * stopped on with that screen's fingerprint.
 */
final readonly class NavigationUncertainty
{
    public function __construct(
        public NavigationReason $reason,
        public int $stalledStep,
        public string $fingerprint,
        public NavigationScreen $screen,
    ) {}
}
