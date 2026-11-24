<?php

declare(strict_types=1);

namespace App\Data\Settings;

use App\Enums\GroupAvailability;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A plain group's availability: always on, with no switch to read or reset.
 */
#[TypeScript]
final class PlainGroupAvailabilityData extends Data
{
    public function __construct(
        public readonly GroupAvailability $state = GroupAvailability::Always,
    ) {}
}
