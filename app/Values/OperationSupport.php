<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\Enums\SupportStatus;

/**
 * Whether one operation is allowed, with the reason the user reads when it is not.
 */
final readonly class OperationSupport
{
    private function __construct(
        public SupportStatus $status,
        public string|null $reason,
    ) {}

    public static function allowed(): self
    {
        return new self(SupportStatus::Allowed, null);
    }

    public static function unavailable(string $reason): self
    {
        return new self(SupportStatus::TemporarilyUnavailable, $reason);
    }

    public static function unsupported(string $reason): self
    {
        return new self(SupportStatus::Unsupported, $reason);
    }

    public function isAllowed(): bool
    {
        return $this->status === SupportStatus::Allowed;
    }
}
