<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Actors\ActorWorkStacks;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\RunClaims;
use App\Contracts\Work\StackTransaction;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\StackAlreadyClosed;
use App\Models\AgentStackRow;
use App\Support\References\Exceptions\ActivationDeclined;
use App\Support\References\SubjectReference;
use App\Support\Storage\FrameRecord;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\Support\WorkingOnTaskStateReference;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Database\Events\QueryExecuted;
use Tests\Support\CommittedHookStack;
use Tests\Support\TimeLimits\TimeLimit;

final class TaskStateContributionTest extends TestCase
{
    use CommittedHookStack;

    private const string STILL_NEEDS_WORK = 'Task %d still needs work';

    public function test_starting_a_task_commits_the_start_and_its_state_together(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        $stored = $task->fresh();
        $this->assertNotNull($stored);
        $this->assertSame([TaskState::Started, 1], [$stored->state, $stored->run_number]);
        $this->assertSame(["tasks.working {$task->id} 1"], $this->taskFrames());
    }

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
            $this->assertSame([TaskState::Open, 0], [$stored->state, $stored->run_number]);
        }
    }

    public function test_starting_a_started_task_again_keeps_one_frame_and_one_run(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.working {$task->id} 1"], $this->taskFrames());
    }

    public function test_the_state_reads_the_task_fresh_and_the_next_hook_passes_over_a_finished_run(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        $held = $this->answerStop('call-1');
        $task->finish('Done.');
        $allowed = $this->answerStop('call-2');

        $this->assertStringContainsString(sprintf(self::STILL_NEEDS_WORK, $task->number), $held);
        $this->assertSame('{}', $allowed);
        $this->assertSame(["tasks.working {$task->id} 1"], $this->taskFrames());
    }

    public function test_a_frame_stops_holding_its_agent_once_its_run_claim_is_gone(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $run = $task->fresh()?->currentRun();
        $this->assertNotNull($run);
        $claims = $this->app->make(RunClaims::class);

        $held = $this->answerStop('call-1');

        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $claims->release($run->assignmentIdentity()),
        );

        $released = $this->answerStop('call-2');

        $this->assertStringContainsString(sprintf(self::STILL_NEEDS_WORK, $task->number), $held);
        $this->assertSame('{}', $released);
        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    public function test_activating_a_task_whose_run_claim_is_gone_is_refused_and_changes_nothing(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $run = $task->fresh()?->currentRun();
        $this->assertNotNull($run);
        $claims = $this->app->make(RunClaims::class);

        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $claims->release($run->assignmentIdentity()),
        );

        $frames = $this->taskFrames();

        $this->assertThrows(
            fn () => $this->app->make(StackTransaction::class)->run(
                fn () => $this->app->make(ActorWorkStacks::class)->push(WorkingOnTaskStateReference::forTask($task)),
            ),
            ActivationDeclined::class,
        );

        $this->assertSame($frames, $this->taskFrames());
    }

    public function test_each_read_of_a_stack_reads_the_runs_of_all_its_task_frames_in_one_query(): void
    {
        $first = Task::factory()->create(['title' => 'Write the walk']);
        $second = Task::factory()->create(['title' => 'Read the walk']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($first->id));
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($second->id));
        $pairQueries = [];

        $this->app->make('db')->listen(function (QueryExecuted $query) use (&$pairQueries): void {
            if (str_contains($query->sql, 'from "task_runs" where (("task_id" = ?')) {
                $pairQueries[] = substr_count($query->sql, '"run_number" = ?');
            }
        });

        $this->answerStop('call-1');

        $this->assertNotEmpty($pairQueries);
        $this->assertSame(array_fill(0, count($pairQueries), 2), $pairQueries);
    }

    public function test_a_finished_task_frame_keeps_its_stored_place(): void
    {
        $first = Task::factory()->create(['title' => 'Write the walk']);
        $second = Task::factory()->create(['title' => 'Read the walk']);
        $commands = $this->app->make(CommandBus::class);

        $commands->run(new StartTaskCommand($first->id));
        $commands->run(new StartTaskCommand($second->id));
        $commands->run(new FinishTaskCommand($second->id, 1, 'Done.'));

        $this->assertSame(["tasks.working {$first->id} 1", "tasks.working {$second->id} 1"], $this->taskFrames());
    }

    public function test_a_new_run_after_a_blocked_one_gets_its_own_frame(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $task->block('Waits.');

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.working {$task->id} 2"], $this->taskFrames());
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

        $this->assertSame(["tasks.working {$first->id} 1", "tasks.working {$second->id} 1"], $this->taskFrames());
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

        $this->assertSame(["tasks.working {$blocked->id} 1", "tasks.working {$cancelled->id} 1"], $this->taskFrames());
        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    public function test_an_agent_finishing_a_task_it_never_started_is_refused_and_leaves_the_stack_alone(): void
    {
        $started = Task::factory()->create(['title' => 'Write the walk']);
        $neverStarted = Task::factory()->create(['title' => 'Someday']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($started->id));

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new FinishTaskCommand($neverStarted->id, 0, 'Done.')),
            ActorNotAllowed::class,
        );

        $this->assertSame(["tasks.working {$started->id} 1"], $this->taskFrames());
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
