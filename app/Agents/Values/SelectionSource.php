<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\DriverSourceType;

/**
 * Where a start's program came from, and the profile and its revision when one took part; a main agent with an
 * explicit program has no profile.
 */
final readonly class SelectionSource
{
    public function __construct(
        public DriverSourceType $driverSource,
        public string|null $profileKey,
        public int|null $profileRevision,
    ) {}
}
