<?php

declare(strict_types=1);

namespace Tests\Unit\Tasks\States;

use App\Domain\Hooks\Decisions\SimpleChange;
use App\Domain\Hooks\Decisions\StopPrevented;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Inputs\StopDetails;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Tasks\States\WorkingOnTask;
use App\Domain\Tasks\TaskWork;
use App\Domain\Tasks\TaskWorkState;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;

final class WorkingOnTaskTest extends TestCase
{
    /**
     * @return iterable<string, array{TaskWorkState}>
     */
    public static function settledStates(): iterable
    {
        yield 'finished' => [TaskWorkState::Finished];
        yield 'blocked' => [TaskWorkState::Blocked];
        yield 'cancelled' => [TaskWorkState::Cancelled];
    }

    /**
     * @return iterable<string, array{HookInput}>
     */
    public static function otherHooks(): iterable
    {
        foreach (HookInputs::all() as $name => $input) {
            if (! $input instanceof StopRequested) {
                yield $name => [$input];
            }
        }
    }

    public function test_unfinished_work_prevents_the_stop_with_a_reason_naming_the_task(): void
    {
        $task = new TaskWork(42, 1, TaskWorkState::Active);

        $decision = (new WorkingOnTask($task))->onStop($this->stop());

        $this->assertInstanceOf(StopPrevented::class, $decision->answer);
        $this->assertStringContainsString('Task 42 still needs work', $decision->answer->reason->text);
        $this->assertSame(SimpleChange::Keep, $decision->change);
        $this->assertSame(TaskWorkState::Active, $task->state);
    }

    public function test_active_work_is_not_finished(): void
    {
        $this->assertFalse((new WorkingOnTask(new TaskWork(42, 1, TaskWorkState::Active)))->isFinished());
    }

    #[DataProvider('settledStates')]
    public function test_a_settled_run_is_finished_and_lets_the_stop_through(TaskWorkState $state): void
    {
        $working = new WorkingOnTask(new TaskWork(42, 1, $state));

        $this->assertTrue($working->isFinished());
        $this->assertTrue($working->onStop($this->stop())->isDelegating());
    }

    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_delegated(HookInput $input): void
    {
        $working = new WorkingOnTask(new TaskWork(42, 1, TaskWorkState::Active));

        $this->assertTrue($input->answerBy($working)->isDelegating());
    }

    private function stop(): StopRequested
    {
        return new StopRequested(new HookIdentity(1, 2, 'hook-1', 'digest'), new StopDetails('turn-1', false));
    }
}
