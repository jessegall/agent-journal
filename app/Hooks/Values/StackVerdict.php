<?php

declare(strict_types=1);

namespace App\Hooks\Values;

use App\Bus\Values\RecoveryCall;

final readonly class StackVerdict
{
    private function __construct(
        public bool $allowed,
        public string $reason,
        public RecoveryCall|null $recovery,
    ) {}

    public static function allow(): self
    {
        return new self(true, '', null);
    }

    public static function refuse(string $reason, RecoveryCall $recovery): self
    {
        return new self(false, $reason, $recovery);
    }
}
