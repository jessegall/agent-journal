<?php

declare(strict_types=1);

namespace App\Connections\Values;

use App\Drivers\Enums\HookDriver;

/**
 * Whether a connected folder may start one program: eligible, or unavailable with the reason the owner reads.
 */
final readonly class ProviderEligibility
{
    private function __construct(public HookDriver $driver, public string $unavailableReason) {}

    public static function eligible(HookDriver $driver): self
    {
        return new self($driver, '');
    }

    public static function unavailable(HookDriver $driver, string $reason): self
    {
        return new self($driver, $reason);
    }

    public function isEligible(): bool
    {
        return $this->unavailableReason === '';
    }
}
