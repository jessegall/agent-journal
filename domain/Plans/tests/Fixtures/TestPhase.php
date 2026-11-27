<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Fixtures;

use App\Support\RecordIdentity;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use PHPUnit\Framework\Assert;

/**
 * A phase the test named, acted on in its own scope: tasks are placed in it and its place and tasks asserted.
 */
final readonly class TestPhase
{
    public function __construct(private PlanFixtures $plans, private string $name) {}

    /**
     * The tasks are placed at the end of the phase, in this order, as the Plans command places them.
     */
    public function place(RecordIdentity ...$tasks): self
    {
        $this->plans->placeIn($this->name, ...$tasks);

        return $this;
    }

    /**
     * The phase belongs to the plan and has this number in it.
     */
    public function assertNumberIn(Plan $plan, int $number): self
    {
        $phase = $this->phase();

        Assert::assertSame([$plan->id, $number], [$phase->plan_id, $phase->number]);

        return $this;
    }

    /**
     * The task stands at this place among the phase's tasks, counted from 1.
     */
    public function assertTask(RecordIdentity $task, int $position): self
    {
        $placed = PhaseTask::query()->ofPhase($this->phase()->id)->inPositionOrder()->pluck('task_id')->all();

        Assert::assertSame(
            $task->id,
            $placed[$position - 1] ?? null,
            "The phase {$this->name} holds another task there.",
        );

        return $this;
    }

    private function phase(): Phase
    {
        return $this->plans->phaseCalled($this->name);
    }
}
