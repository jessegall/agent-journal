<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\RunClaims;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\StackAlreadyClosed;
use App\Models\Agents\AgentFocus;
use App\Models\Agents\AgentStackRow;
use App\Support\References\SubjectReference;
use App\Support\Storage\FrameRecord;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Support\States\WorkOnTaskState;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommittedHookStack;
use Tests\Support\TimeLimits\TimeLimit;

final class TaskStateContributionTest extends TestCase
{
    use CommittedHookStack;

    private const string STILL_NEEDS_WORK = 'Task %d still needs work';

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
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
        $task = Task::factory()->create(['title' => 'Write the walk']);

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.work {$task->id} 1"], $this->taskFrames());
    }

    /**
     * @return list<string> the task of each log-due frame that is not yet logged
     */
    private function openLogDueFrames(): array
    {
        $frames = array_filter(
            AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(),
            fn (FrameRecord $frame) => $frame->reference->typeKey === LogDueStateReference::TYPE_KEY
                && ($frame->values['isLogged'] ?? false) === false,
        );

        return array_values(array_map(fn (FrameRecord $frame) => $frame->reference->subject->id, $frames));
    }

    public function test_a_finished_task_frame_keeps_its_stored_place(): void
    {
        $first = Task::factory()->create(['title' => 'Write the walk']);
        $second = Task::factory()->create(['title' => 'Read the walk']);
        $commands = $this->app->make(CommandBus::class);

        $commands->run(new StartTaskCommand($first->id));
        $commands->run(new StartTaskCommand($second->id));
        $commands->run(new FinishTaskCommand($second->id, 1, 'Done.'));

        $this->assertSame([
            "tasks.work {$first->id} 1",
            "tasks.work {$second->id} 1",
        ], $this->taskFrames());
    }

    public function test_a_new_run_after_a_blocked_one_gets_its_own_frame(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $this->app->make(CommandBus::class)->run(new BlockTaskCommand($task->id, 1, 'Waits.'));

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.work {$task->id} 2"], $this->taskFrames());
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_finishing_a_task_changes_only_the_task_and_the_task_below_is_current_again(): void
    {
        $first = Task::factory()->create(['title' => 'Write the walk']);
        $second = Task::factory()->create(['title' => 'Fix the hook']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($first->id));
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($second->id));
        $tasks = $this->app->make(AssignedTaskResolver::class);

        $this->assertSame($second->number, $tasks->currentForCaller()->get()->number);

        $this->app->make(CommandBus::class)->run(new FinishTaskCommand($second->id, 1, 'Fixed.'));

        $this->assertSame([
            "tasks.work {$first->id} 1",
            "tasks.work {$second->id} 1",
        ], $this->taskFrames());
        $this->assertSame($first->number, $tasks->currentForCaller()->get()->number);
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_blocking_or_cancelling_a_task_leaves_its_frame_stored_and_no_task_current(): void
    {
        $blocked = Task::factory()->create(['title' => 'Wait for review']);
        $cancelled = Task::factory()->create(['title' => 'Drop the idea']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($blocked->id));
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($cancelled->id));

        $this->app->make(CommandBus::class)->run(new CancelTaskCommand($cancelled->id, 'Dropped.'));
        $this->app->make(CommandBus::class)->run(new BlockTaskCommand($blocked->id, 1, 'Waits for review.'));

        $this->assertSame([
            "tasks.work {$blocked->id} 1",
            "tasks.work {$cancelled->id} 1",
        ], $this->taskFrames());
        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    #[TimeLimit(seconds: 3, reason: 'It runs three task commands through the bus, each with its stack transaction.')]
    public function test_focusing_the_older_of_two_tasks_brings_its_work_back_on_top(): void
    {
        $first = Task::factory()->create(['title' => 'Write the walk']);
        $second = Task::factory()->create(['title' => 'Fix the hook']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($first->id));
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($second->id));

        $this->assertSame([$second->id], $this->focusedTaskIds());

        $this->app->make(CommandBus::class)->run(new FocusTaskCommand($first->id));

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
        return array_values(AgentFocus::query()->where('agent_id', $this->target->agentId)->pluck('focused_id')->all());
    }

    /**
     * @return list<string> each frame as its type, task id and run
     */
    private function taskFrames(): array
    {
        $frames = array_filter(
            AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(),
            fn (FrameRecord $frame) => ! $frame->isBottom,
        );

        return array_values(array_map(function (FrameRecord $frame): string {
            $subject = $frame->reference->subject;
            $this->assertInstanceOf(SubjectReference::class, $subject);

            return "{$frame->reference->typeKey} {$subject->id} {$subject->runNumber}";
        }, $frames));
    }
}
