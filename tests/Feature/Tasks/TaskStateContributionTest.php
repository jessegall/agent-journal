<?php

declare(strict_types=1);

namespace Tests\Feature\Tasks;

use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Exceptions\StackAlreadyClosed;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Storage\FrameRecord;
use App\Domain\Tasks\Actions\StartTask;
use App\Domain\Tasks\Enums\TaskState;
use App\Domain\Tasks\Models\Task;
use Carbon\CarbonImmutable;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class TaskStateContributionTest extends TestCase
{
    use CommittedHookStack;

    public function test_starting_a_task_commits_the_start_and_its_state_together(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);

        $this->app->make(StartTask::class)->start($task, $this->target);

        $stored = $task->fresh();
        $this->assertNotNull($stored);
        $this->assertSame([TaskState::Started, 1, 1, 10], [$stored->state, $stored->run_number, $stored->agent_id, $stored->session_id]);
        $this->assertSame(["tasks.working {$task->id} 1"], $this->taskFrames());
    }

    public function test_a_failed_push_rolls_the_start_back(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(StartTask::class)->start($task, $this->target);
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

        $this->app->make(StartTask::class)->start($task, $this->target);
        $this->app->make(StartTask::class)->start($task, $this->target);

        $this->assertSame(["tasks.working {$task->id} 1"], $this->taskFrames());
    }

    public function test_the_state_reads_the_task_fresh_and_the_next_hook_removes_a_finished_run(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->make(StartTask::class)->start($task, $this->target);

        $held = $this->answerStop('call-1');
        $task->finish();
        $allowed = $this->answerStop('call-2');

        $this->assertStringContainsString("Task {$task->id} still needs work", $held);
        $this->assertSame('{}', $allowed);
        $this->assertSame([], $this->taskFrames());
    }

    public function test_a_new_run_after_a_finished_one_gets_its_own_frame(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->make(StartTask::class)->start($task, $this->target);
        $task->finish();

        $this->app->make(StartTask::class)->start($task, $this->target);

        $this->assertSame(["tasks.working {$task->id} 2"], $this->taskFrames());
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
