<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Drivers\SupportState;

/**
 * Whether one operation is allowed, with the reason the user reads when it is not.
 */
final readonly class OperationSupport
{
    private function __construct(
        public SupportState $state,
        public string|null $reason,
    ) {}

    public static function allowed(): self
    {
        return new self(SupportState::Allowed, null);
    }

    public static function unavailable(string $reason): self
    {
        return new self(SupportState::TemporarilyUnavailable, $reason);
    }

    public static function unsupported(string $reason): self
    {
        return new self(SupportState::Unsupported, $reason);
    }

    public function isAllowed(): bool
    {
        return $this->state === SupportState::Allowed;
    }
}
