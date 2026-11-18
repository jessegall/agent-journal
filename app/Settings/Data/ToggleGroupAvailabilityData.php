<?php

declare(strict_types=1);

namespace App\Settings\Data;

use App\Settings\Enums\GroupAvailability;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A group that can be switched off: whether it is on, off or stored wrongly, and the state it has by default. The
 * group's identity is the address that resets its switch.
 */
#[TypeScript]
final class ToggleGroupAvailabilityData extends Data
{
    public function __construct(
        public readonly GroupAvailability $state,
        public readonly bool $defaultEnabled,
    ) {}
}
