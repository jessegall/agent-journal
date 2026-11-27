<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Models\TaskWait;
use PHPUnit\Framework\Assert;

/**
 * A task the test named, asserted in its own scope: how many runs it had and what it waits on.
 */
final readonly class TestTask
{
    public function __construct(private TaskFixtures $tasks, private string $name) {}

    public function assertRunCount(int $count): self
    {
        Assert::assertSame(
            $count,
            TaskRun::query()->where('task_id', $this->tasks->taskCalled($this->name)->id)->count(),
        );

        return $this;
    }

    /**
     * The task waits on the named prerequisite, met or not, waived or not.
     */
    public function assertWait(string $prerequisite, bool $isSatisfied, bool $isWaived = false): self
    {
        $before = $this->tasks->taskCalled($prerequisite);

        $wait = TaskWait::findBetween($this->tasks->taskCalled($this->name)->id, $before->id)
            ?? Assert::fail("{$this->name} does not wait on {$prerequisite}.");

        Assert::assertSame([$isSatisfied, $isWaived], [$wait->isSatisfiedBy($before->status), $wait->isWaived()]);

        return $this;
    }
}
