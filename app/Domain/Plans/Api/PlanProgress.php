<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api;

/**
 * How far a plan's tasks have got, in Plans' own words: how many are done, started, blocked, and how many there are.
 */
final readonly class PlanProgress
{
    public function __construct(
        public int $done,
        public int $started,
        public int $blocked,
        public int $total,
    ) {}

    public static function none(): self
    {
        return new self(done: 0, started: 0, blocked: 0, total: 0);
    }

    public function plus(self $other): self
    {
        return new self($this->done + $other->done, $this->started + $other->started, $this->blocked + $other->blocked, $this->total + $other->total);
    }

    public function isComplete(): bool
    {
        return $this->done === $this->total;
    }
}
