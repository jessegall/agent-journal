<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StackAlreadyClosed;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Contracts\AssignedTaskReader;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommittedHookStack;
use Tests\Support\TimeLimits\TimeLimit;

final class TaskStateContributionTest extends TestCase
{
    use CommittedHookStack;

    public function test_starting_a_task_commits_the_start_and_its_state_together(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);

        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));

        $stored = $task->fresh();
        $this->assertNotNull($stored);
        $this->assertSame([TaskState::Started, 1], [$stored->state, $stored->run_number]);
        $this->assertSame(["tasks.working {$task->id} 1"], $this->taskFrames());
    }

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));
            $this->fail('The start went through without its push.');
        } catch (StackAlreadyClosed) {
            $stored = $task->fresh();
            $this->assertNotNull($stored);
            $this->assertSame([TaskState::Open, 0], [$stored->state, $stored->run_number]);
        }
    }

    public function test_starting_a_started_task_again_keeps_one_frame_and_one_run(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);

        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));
        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));

        $this->assertSame(["tasks.working {$task->id} 1"], $this->taskFrames());
    }

    public function test_the_state_reads_the_task_fresh_and_the_next_hook_removes_a_finished_run(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));

        $held = $this->answerStop('call-1');
        $task->finish();
        $allowed = $this->answerStop('call-2');

        $this->assertStringContainsString("Task {$task->number} still needs work", $held);
        $this->assertSame('{}', $allowed);
        $this->assertSame([], $this->taskFrames());
    }

    public function test_a_new_run_after_a_finished_one_gets_its_own_frame(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));
        $task->finish();

        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));

        $this->assertSame(["tasks.working {$task->id} 2"], $this->taskFrames());
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_finishing_a_task_in_its_command_takes_its_frame_off_and_the_task_below_is_current_again(): void
    {
        $first = Task::query()->create(['title' => 'Write the walk']);
        $second = Task::query()->create(['title' => 'Fix the hook']);
        $this->app->make(CommandBus::class)->run(new StartTask($first->id, $this->target->sessionId));
        $this->app->make(CommandBus::class)->run(new StartTask($second->id, $this->target->sessionId));
        $tasks = $this->app->make(AssignedTaskReader::class);

        $this->assertSame($second->number, $tasks->currentForCaller()->get()->number);

        $this->app->make(CommandBus::class)->run(new FinishTask($second->id));

        $this->assertSame(["tasks.working {$first->id} 1"], $this->taskFrames());
        $this->assertSame($first->number, $tasks->currentForCaller()->get()->number);
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_blocking_or_cancelling_a_task_takes_its_frame_off_in_the_same_command(): void
    {
        $blocked = Task::query()->create(['title' => 'Wait for review']);
        $cancelled = Task::query()->create(['title' => 'Drop the idea']);
        $this->app->make(CommandBus::class)->run(new StartTask($blocked->id, $this->target->sessionId));
        $this->app->make(CommandBus::class)->run(new StartTask($cancelled->id, $this->target->sessionId));

        $this->app->make(CommandBus::class)->run(new CancelTask($cancelled->id));
        $this->app->make(CommandBus::class)->run(new BlockTask($blocked->id));

        $this->assertSame([], $this->taskFrames());
        $this->assertTrue($this->app->make(AssignedTaskReader::class)->currentForCaller()->isEmpty());
    }

    public function test_finishing_a_task_never_started_leaves_the_stack_alone(): void
    {
        $started = Task::query()->create(['title' => 'Write the walk']);
        $neverStarted = Task::query()->create(['title' => 'Someday']);
        $this->app->make(CommandBus::class)->run(new StartTask($started->id, $this->target->sessionId));

        $this->app->make(CommandBus::class)->run(new FinishTask($neverStarted->id));

        $this->assertSame(["tasks.working {$started->id} 1"], $this->taskFrames());
    }

    /**
     * @return list<string> each frame as its type, task id and run
     */
    private function taskFrames(): array
    {
        $frames = array_filter(AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(), fn (FrameRecord $frame) => ! $frame->isBottom);

        return array_values(array_map(function (FrameRecord $frame): string {
            $subject = $frame->reference->subject;
            $this->assertInstanceOf(SubjectReference::class, $subject);

            return "{$frame->reference->typeKey} {$subject->id} {$subject->runNumber}";
        }, $frames));
    }
}
