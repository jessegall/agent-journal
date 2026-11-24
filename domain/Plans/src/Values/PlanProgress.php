<?php

declare(strict_types=1);

namespace Domain\Plans\Values;

/**
 * How far a phase's or a plan's tasks have got, in Plans' own words: how many are finished, cancelled, blocked and
 * started, and how many there are. The rest are open.
 */
final readonly class PlanProgress
{
    public function __construct(
        public int $finished,
        public int $cancelled,
        public int $blocked,
        public int $started,
        public int $total,
    ) {}

    public static function none(): self
    {
        return new self(finished: 0, cancelled: 0, blocked: 0, started: 0, total: 0);
    }

    public function plus(self $other): self
    {
        return new self(
            $this->finished + $other->finished,
            $this->cancelled + $other->cancelled,
            $this->blocked + $other->blocked,
            $this->started + $other->started,
            $this->total + $other->total,
        );
    }

    /**
     * How many tasks still need work: neither finished nor cancelled.
     */
    public function unfinished(): int
    {
        return $this->total - $this->finished - $this->cancelled;
    }

    /**
     * Whether no task is left to finish: as many finished as there are, so zero of zero counts as complete; the
     * current phase is the first that is not (Phase::currentNumbersOf).
     */
    public function isComplete(): bool
    {
        return $this->finished >= $this->total;
    }
}
