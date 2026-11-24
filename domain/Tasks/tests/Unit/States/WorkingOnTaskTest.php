<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Unit\States;

use App\Contracts\Processes\RunClaims;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\Support\States\WorkingOnTaskState;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;

/**
 * The task state keeps its run open until it hears its own task finished, blocked or cancelled, and passes every
 * hook but the stop.
 */
final class WorkingOnTaskTest extends TestCase
{
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

    public function test_a_new_run_is_not_finished(): void
    {
        $this->assertFalse($this->working()->isFinished());
    }

    public function test_hearing_its_task_finished_blocked_or_cancelled_ends_the_run(): void
    {
        $finished = $this->working();
        $finished->onTaskFinished(new TaskFinished('task-42', TaskState::Started, 'history-1'));
        $blocked = $this->working();
        $blocked->onTaskBlocked(new TaskBlocked('task-42', TaskState::Started, 'history-1'));
        $cancelled = $this->working();
        $cancelled->onTaskCancelled(new TaskCancelled('task-42', TaskState::Started, 'history-1'));

        $this->assertTrue($finished->isFinished());
        $this->assertTrue($blocked->isFinished());
        $this->assertTrue($cancelled->isFinished());
    }

    public function test_another_tasks_end_leaves_the_run_open(): void
    {
        $working = $this->working();

        $working->onTaskFinished(new TaskFinished('task-43', TaskState::Started, 'history-1'));

        $this->assertFalse($working->isFinished());
    }

    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_passed(HookInput $input): void
    {
        $this->assertEquals(Decision::delegate(), $input->answerBy($this->working()));
    }

    private function working(): WorkingOnTaskState
    {
        return new WorkingOnTaskState('task-42', 42, 1, new TaskRecords(), $this->createStub(RunClaims::class));
    }
}
