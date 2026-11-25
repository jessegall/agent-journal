<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Exceptions\StackAlreadyClosed;
use App\Models\Agents\AgentFocus;
use App\Models\Agents\AgentStackRow;
use App\Support\References\SubjectReference;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;

final class TaskStateContributionTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'agent_stacks',
        'tasks',
        'task_runs',
        'assignments',
        'agent_focuses',
        'command_receipts',
    ];

    private TaskFixtures $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->actAs('Writer');
        $this->tasks = $this->journal->fixtures(TaskFixtures::class);
    }

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        $task = $this->tasks->task('Write the walk')->taskCalled('Write the walk');
        AgentStackRow::query()->withoutGlobalScopes()->forTarget($this->writerTarget())->sole()->closeAt(
            CarbonImmutable::now(),
        );

        try {
            $this->journal->run(new StartTaskCommand($task->id));
            $this->fail('The start went through without its push.');
        } catch (StackAlreadyClosed) {
            $stored = $task->fresh();
            $this->assertNotNull($stored);
            $this->assertSame([
                TaskStatus::Open,
                0,
            ], [
                $stored->status,
                $stored->run_number,
            ]);
        }
    }

    public function test_starting_a_started_task_again_keeps_one_frame_and_one_run(): void
    {
        $task = $this->tasks->task('Write the walk')->taskCalled('Write the walk');

        $this->journal->run(new StartTaskCommand($task->id));
        $this->journal->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.work {$task->id} 1"], $this->taskFrames());
    }

    public function test_a_finished_task_frame_keeps_its_stored_place(): void
    {
        $first = $this->tasks->task('Write the walk')->taskCalled('Write the walk');
        $second = $this->tasks->task('Read the walk')->taskCalled('Read the walk');

        $this->journal->run(new StartTaskCommand($first->id));
        $this->journal->run(new StartTaskCommand($second->id));
        $this->journal->run(new FinishTaskCommand($second->id, 1, 'Done.'));

        $this->assertSame([
            "tasks.work {$first->id} 1",
            "tasks.work {$second->id} 1",
        ], $this->taskFrames());
    }

    public function test_a_new_run_after_a_blocked_one_gets_its_own_frame(): void
    {
        $task = $this->tasks->task('Write the walk')->taskCalled('Write the walk');
        $this->journal->run(new StartTaskCommand($task->id));
        $this->journal->run(new BlockTaskCommand($task->id, 1, 'Waits.'));

        $this->journal->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.work {$task->id} 2"], $this->taskFrames());
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_finishing_a_task_changes_only_the_task_and_the_task_below_is_current_again(): void
    {
        $first = $this->tasks->task('Write the walk')->taskCalled('Write the walk');
        $second = $this->tasks->task('Fix the hook')->taskCalled('Fix the hook');
        $this->journal->run(new StartTaskCommand($first->id));
        $this->journal->run(new StartTaskCommand($second->id));
        $tasks = $this->app->make(AssignedTaskResolver::class);

        $this->assertSame($second->number, $tasks->currentForCaller()->get()->number);

        $this->journal->run(new FinishTaskCommand($second->id, 1, 'Fixed.'));

        $this->assertSame([
            "tasks.work {$first->id} 1",
            "tasks.work {$second->id} 1",
        ], $this->taskFrames());
        $this->assertSame($first->number, $tasks->currentForCaller()->get()->number);
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_blocking_or_cancelling_a_task_leaves_its_frame_stored_and_no_task_current(): void
    {
        $blocked = $this->tasks->task('Wait for review')->taskCalled('Wait for review');
        $cancelled = $this->tasks->task('Drop the idea')->taskCalled('Drop the idea');
        $this->journal->run(new StartTaskCommand($blocked->id));
        $this->journal->run(new StartTaskCommand($cancelled->id));

        $this->journal->run(new CancelTaskCommand($cancelled->id, 'Dropped.'));
        $this->journal->run(new BlockTaskCommand($blocked->id, 1, 'Waits for review.'));

        $this->assertSame([
            "tasks.work {$blocked->id} 1",
            "tasks.work {$cancelled->id} 1",
        ], $this->taskFrames());
        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    #[TimeLimit(seconds: 3, reason: 'It runs three task commands through the bus, each with its stack transaction.')]
    public function test_focusing_the_older_of_two_tasks_brings_its_work_back_on_top(): void
    {
        $first = $this->tasks->task('Write the walk')->taskCalled('Write the walk');
        $second = $this->tasks->task('Fix the hook')->taskCalled('Fix the hook');
        $this->journal->run(new StartTaskCommand($first->id));
        $this->journal->run(new StartTaskCommand($second->id));

        $this->assertSame([$second->id], $this->focusedTaskIds());

        $this->journal->run(new FocusTaskCommand($first->id));

        $this->assertSame([$first->id], $this->focusedTaskIds());
        $this->assertSame([
            "tasks.work {$second->id} 1",
            "tasks.work {$first->id} 1",
        ], $this->taskFrames());

        $this->assertSame(
            $first->number,
            $this->app->make(AssignedTaskResolver::class)->currentForCaller()->get()->number,
        );
    }

    /**
     * @return list<string>
     */
    private function focusedTaskIds(): array
    {
        return array_values(
            AgentFocus::query()->where('agent_id', $this->writerTarget()->agentId)->pluck('focused_id')->all(),
        );
    }

    /**
     * @return list<string> each frame as its type, task id and run
     */
    private function taskFrames(): array
    {
        $frames = array_filter(
            AgentStackRow::query()->withoutGlobalScopes()->forTarget($this->writerTarget())->sole()->frames->all(),
            fn (FrameRecord $frame) => ! $frame->isBottom,
        );

        return array_values(array_map(function (FrameRecord $frame): string {
            $subject = $frame->reference->subject;
            $this->assertInstanceOf(SubjectReference::class, $subject);

            return "{$frame->reference->typeKey} {$subject->id} {$subject->runNumber}";
        }, $frames));
    }

    private function writerTarget(): StackTarget
    {
        return $this->journal->sessionOf('Writer')->target;
    }
}
