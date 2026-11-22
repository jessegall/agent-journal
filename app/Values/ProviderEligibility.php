<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Whether a connected folder may start one driver: eligible, or unavailable with the reason the owner reads.
 */
final readonly class ProviderEligibility
{
    private function __construct(public DriverFamily $family, public string $unavailableReason) {}

    public static function eligible(DriverFamily $family): self
    {
        return new self($family, '');
    }

    public static function unavailable(DriverFamily $family, string $reason): self
    {
        return new self($family, $reason);
    }

    public function isEligible(): bool
    {
        return $this->unavailableReason === '';
    }
}
