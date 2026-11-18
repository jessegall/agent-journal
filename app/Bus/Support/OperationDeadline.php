<?php

declare(strict_types=1);

namespace App\Bus\Support;

/**
 * How long one stack operation may take, start to commit; the lock wait gets most of it and every statement fits inside it.
 */
final readonly class OperationDeadline
{
    public function __construct(public int $milliseconds = 5000) {}

    public function hasRunOut(): bool
    {
        return $this->milliseconds <= 0;
    }

    public function lockMilliseconds(): int
    {
        return max(1, intdiv($this->milliseconds * 4, 5));
    }
}
