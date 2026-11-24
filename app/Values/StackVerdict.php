<?php

declare(strict_types=1);

namespace App\Values;

final readonly class StackVerdict
{
    private function __construct(
        public bool $allowed,
        public AgentText|null $reason,
        public RecoveryCall|null $recovery,
    ) {}

    public static function allow(): self
    {
        return new self(true, null, null);
    }

    public static function refuse(AgentText $reason, RecoveryCall $recovery): self
    {
        return new self(false, $reason, $recovery);
    }
}
