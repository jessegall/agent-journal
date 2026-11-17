<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

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
    ) {}

    /**
     * @param  array<array-key, int>  $countOfState  how many tasks are in each state, by the state's value; a state
     *                                               with no tasks may be left out
     */
    public static function ofStates(array $countOfState): self
    {
        $count = [...array_fill_keys(array_column(TaskState::cases(), 'value'), 0), ...$countOfState];

        return new self(
            done: $count[TaskState::Finished->value],
            started: $count[TaskState::Started->value],
            blocked: $count[TaskState::Blocked->value],
            total: array_sum($count),
        );
    }

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
