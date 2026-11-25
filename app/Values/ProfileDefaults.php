<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;

/**
 * What a profile prefers for a start, as plain values from its owner: the driver it preselects, the tier of work that
 * names the default model, and its default driver type. Every driver and model can still be chosen.
 */
final readonly class ProfileDefaults
{
    public function __construct(
        public string $key,
        public int $revision,
        public string|null $preferredDriver,
        public ModelTier $preferredTier,
        public DriverType $defaultDriverType,
    ) {}
}
