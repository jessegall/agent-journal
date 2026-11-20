<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Unit\States;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Denied;
use App\Hooks\Enums\SimpleTransition;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\States\WorkingOnTaskState;
use Domain\Tasks\Support\TaskWork;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestIds;

final class WorkingOnTaskTest extends TestCase
{
    /**
     * @return iterable<string, array{TaskState}>
     */
    public static function settledStates(): iterable
    {
        yield 'finished' => [TaskState::Finished];

        yield 'blocked' => [TaskState::Blocked];

        yield 'cancelled' => [TaskState::Cancelled];

        yield 'released to open' => [TaskState::Open];
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
        $task = new TaskWork(42, 1, TaskState::Started);

        $decision = new WorkingOnTaskState($task)->onStop($this->stop());

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('Task 42 still needs work', $decision->refusalReason());
        $this->assertSame(SimpleTransition::Keep, $decision->transition);
        $this->assertSame(TaskState::Started, $task->state);
    }

    public function test_active_work_is_not_finished(): void
    {
        $this->assertFalse(new WorkingOnTaskState(new TaskWork(42, 1, TaskState::Started))->isFinished());
    }

    #[DataProvider('settledStates')]
    public function test_a_settled_run_is_finished(TaskState $state): void
    {
        $this->assertTrue(new WorkingOnTaskState(new TaskWork(42, 1, $state))->isFinished());
    }

    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_delegated(HookInput $input): void
    {
        $working = new WorkingOnTaskState(new TaskWork(42, 1, TaskState::Started));

        $this->assertTrue($input->answerBy($working)->isDelegating());
    }

    private function stop(): StopRequested
    {
        return new StopRequested(
            new HookIdentity(TestIds::of(1), TestIds::of(2), 'hook-1', 'digest'),
            new StopDetails('turn-1', false),
        );
    }
}
