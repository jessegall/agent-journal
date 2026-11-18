<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

/**
 * How far a set of tasks has got: how many are done, started, blocked, and how many there are.
 */
final readonly class TaskProgress
{
    public function __construct(
        public int $done,
        public int $started,
        public int $blocked,
        public int $total,
        public int $cancelled = 0,
    ) {}

    public static function none(): self
    {
        return new self(done: 0, started: 0, blocked: 0, total: 0);
    }

    public function plus(self $other): self
    {
        return new self($this->done + $other->done, $this->started + $other->started, $this->blocked + $other->blocked, $this->total + $other->total, $this->cancelled + $other->cancelled);
    }

    /**
     * How many tasks still need work: neither finished nor cancelled.
     */
    public function unfinished(): int
    {
        return $this->total - $this->done - $this->cancelled;
    }

    public function isComplete(): bool
    {
        return $this->done === $this->total;
    }
}
