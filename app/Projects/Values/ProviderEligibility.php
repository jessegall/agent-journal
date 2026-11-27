<?php

declare(strict_types=1);

namespace App\Projects\Values;

use App\Values\DriverFamily;

/**
 * Whether a connected folder may start one driver: eligible, or unavailable with the reason the owner reads.
 */
final readonly class ProviderEligibility
{
    private function __construct(public DriverFamily $family, public string|null $unavailableReason) {}

    public static function eligible(DriverFamily $family): self
    {
        return new self($family, null);
    }

    public static function unavailable(DriverFamily $family, string $reason): self
    {
        return new self($family, $reason);
    }
}
