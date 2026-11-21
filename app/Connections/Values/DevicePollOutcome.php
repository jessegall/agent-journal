<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * What a poll of a device code answered and kept: still waiting for the owner, or issued once, with the sign-in's
 * reference. A waiting poll is an answer, not a refusal, so the time it was polled at is kept.
 */
final readonly class DevicePollOutcome
{
    public const string PENDING = 'authorization_pending';

    public const string ISSUED = 'issued';

    public function __construct(public string $outcome, public string $reference) {}

    public function isPending(): bool
    {
        return $this->outcome === self::PENDING;
    }
}
