<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Domain\Tasks\Api\TaskProgress;
use Domain\Tasks\Enums\TaskState;

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

    /**
     * The progress Tasks counted for a set of tasks, such as the tasks just placed in a phase.
     */
    public static function fromTaskProgress(TaskProgress $progress): self
    {
        return new self($progress->done, $progress->cancelled, $progress->blocked, $progress->started, $progress->total);
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
     * The same tasks after one of them moved from one state to another.
     */
    public function withMove(TaskState $from, TaskState $to): self
    {
        return $this->withChange($from, -1)->withChange($to, 1);
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

    private function withChange(TaskState $state, int $change): self
    {
        return match ($state) {
            TaskState::Open => $this,
            TaskState::Started => new self(
                $this->finished,
                $this->cancelled,
                $this->blocked,
                $this->started + $change,
                $this->total,
            ),
            TaskState::Blocked => new self(
                $this->finished,
                $this->cancelled,
                $this->blocked + $change,
                $this->started,
                $this->total,
            ),
            TaskState::Finished => new self(
                $this->finished + $change,
                $this->cancelled,
                $this->blocked,
                $this->started,
                $this->total,
            ),
            TaskState::Cancelled => new self(
                $this->finished,
                $this->cancelled + $change,
                $this->blocked,
                $this->started,
                $this->total,
            ),
        };
    }
}
