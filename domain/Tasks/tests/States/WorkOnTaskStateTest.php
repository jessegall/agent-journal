<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\States;

use App\Contracts\Events\Event;
use App\Enums\Hooks\AnswerType;
use App\Events\Assignments\AssignmentsEnded;
use App\Models\Agents\AgentFocus;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorIdentity;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\References\SubjectReference;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Commands\UnfocusTask\UnfocusTaskCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Events\TaskRunClaimed;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;
use Domain\Tasks\Support\States\WorkOnTaskState;
use Domain\Tasks\Tests\Fixtures\AgentMidTask;
use Domain\Tasks\Tests\Fixtures\RunningTask;
use Domain\Tasks\Tests\Fixtures\StartNamedTask;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHooks;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The work-on-task state on the real engine, pushed by starting its task: its task finishing, blocking or being
 * cancelled ends the run while another task's end does not; the stop is held while its claim holds; a log falls due
 * after the tool use limit; entering or resuming focuses its task and exiting takes the focus away; and each run of a
 * task keeps one frame of its own in its stored place.
 */
#[TestsState(WorkOnTaskState::class)]
final class WorkOnTaskStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = [
        'agent_stacks',
        'tasks',
        'task_runs',
        'assignments',
        'agent_focuses',
        'command_receipts',
    ];

    private RunningTask $work;

    /**
     * @return iterable<string, array{class-string<Event>}>
     */
    public static function endings(): iterable
    {
        yield 'finished' => [TaskFinished::class];

        yield 'blocked' => [TaskBlocked::class];

        yield 'cancelled' => [TaskCancelled::class];
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

    /**
     * @param  class-string<TaskFinished|TaskBlocked|TaskCancelled>  $ending
     */
    #[DataProvider('endings')]
    public function test_its_task_ending_ends_the_run_and_another_tasks_does_not(string $ending): void
    {
        $this->startWork();
        $other = $this->journal->fixtures(TaskFixtures::class)->task('Other', 'Independent work')->taskCalled('Other');

        $this->working()
            ->given(
                new $ending($other->id, TaskStatus::Started, 'entry-1'),
                fn (StateObservation $state) => $state->assertLive(),
            )
            ->given(
                new $ending($this->work->task->id, TaskStatus::Started, 'entry-2'),
                fn (StateObservation $state) => $state->assertFinished(),
            );
    }

    public function test_a_stop_is_held_back_while_its_claim_holds_and_let_through_once_a_claim_assignment_ended(): void
    {
        $this->startWork();

        $this->working()
            ->given([
                $this->claimed($this->agent(), ['claim-1', 'seat-1', 'work-1']),
                $this->hooks()->stop('turn-1'),
            ], fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny))
            ->given([
                new AssignmentsEnded(['seat-1']),
                $this->hooks()->stop('turn-2'),
            ], function (StateObservation $state) {
                $state->assertStateAnswer(AnswerType::Delegate);
                $state->assertFinished();
            });
    }

    public function test_the_late_end_of_an_earlier_claim_leaves_a_resumed_run_held(): void
    {
        $this->startWork();

        $this->working()->given([
            $this->claimed($this->agent(), ['claim-1', 'work-1']),
            $this->claimed($this->agent(), ['claim-2', 'work-1']),
            new AssignmentsEnded(['claim-1']),
            $this->hooks()->stop(),
        ], fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny));
    }

    public function test_a_newer_run_of_its_task_ends_the_older_run(): void
    {
        $this->startWork();
        $newer = new TaskRunClaimed(
            $this->work->task->id,
            $this->work->task->run_number + 1,
            $this->agent(),
            ['claim-9'],
        );

        $this->working()->given($newer, fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_a_claim_another_agent_took_lets_the_stop_through(): void
    {
        $this->startWork();
        $other = ActorIdentity::fromText('agent:01jd8x0g9m3qz6v4k2t7r5w1cz');

        $this->working()->given(
            [$this->claimed($other, ['claim-3']), $this->hooks()->stop()],
            fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
        );
    }

    public function test_a_log_falls_due_after_the_tool_use_limit(): void
    {
        $this->startWork();
        $uses = array_fill(0, WorkOnTaskState::LOG_DUE_AFTER - 1, $this->toolFinished());

        $this->working()
            ->given(
                $uses,
                fn (StateObservation $state) => $state->assertValue(
                    'toolUsesSinceLog',
                    WorkOnTaskState::LOG_DUE_AFTER - 1,
                ),
            )
            ->given($this->toolFinished(), function (StateObservation $state) {
                $state->assertPushed(LogDueStateReference::forTask($this->work->task->id, $this->work->task->number));
                $state->assertValue('toolUsesSinceLog', 0);
            });
    }

    public function test_a_log_on_its_task_starts_the_count_again(): void
    {
        $this->startWork();

        $this->working()->given(
            [
                $this->toolFinished(),
                new TaskLogged($this->work->task->id, 'entry-1'),
            ],
            fn (StateObservation $state) => $state->assertValue('toolUsesSinceLog', 0),
        );
    }

    public function test_entering_or_resuming_focuses_its_task_and_exiting_takes_the_focus_away(): void
    {
        $this->startWork();

        $this->assertSame([$this->work->task->id], $this->focusedTaskIds());

        $second = $this->journal->startScenario(new StartNamedTask('Jo', 'Writer', 'Second'));
        $this->journal->sinkCommands();

        $this->journal
            ->stateOn($second->session, WorkOnTaskStateReference::forTask($second->task))
            ->given(
                new TaskFinished($second->task->id, TaskStatus::Started, 'entry-1'),
                fn (StateObservation $state) => $state->assertFinished(),
            );

        $this->journal->assertDispatchedInOrder([
            ExpectedCommand::of(UnfocusTaskCommand::class, ['taskId' => $second->task->id]),
            ExpectedCommand::of(FocusTaskCommand::class, ['taskId' => $this->work->task->id]),
        ]);
    }

    /**
     * The hooks a state test's driver sends no other way, such as a prompt or a compaction, pass the state itself.
     */
    #[DataProvider('otherHooks')]
    public function test_every_other_hook_is_passed(HookInput $input): void
    {
        $this->assertEquals(Decision::delegate(), $input->answerBy(new WorkOnTaskState('task-42', 42, 1)));
    }

    public function test_starting_a_started_task_again_keeps_one_frame_and_one_run(): void
    {
        $task = $this->writersTasks()->task('Write the walk')->taskCalled('Write the walk');

        $this->journal->run(new StartTaskCommand($task->id));
        $this->journal->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.work {$task->id} 1"], $this->taskFrames());
    }

    public function test_a_finished_task_frame_keeps_its_stored_place(): void
    {
        $tasks = $this->writersTasks();
        $first = $tasks->task('Write the walk')->taskCalled('Write the walk');
        $second = $tasks->task('Read the walk')->taskCalled('Read the walk');

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
        $task = $this->writersTasks()->task('Write the walk')->taskCalled('Write the walk');
        $this->journal->run(new StartTaskCommand($task->id));
        $this->journal->run(new BlockTaskCommand($task->id, 1, 'Waits.'));

        $this->journal->run(new StartTaskCommand($task->id));

        $this->assertSame(["tasks.work {$task->id} 2"], $this->taskFrames());
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_finishing_a_task_changes_only_the_task_and_the_task_below_is_current_again(): void
    {
        $tasks = $this->writersTasks();
        $first = $tasks->task('Write the walk')->taskCalled('Write the walk');
        $second = $tasks->task('Fix the hook')->taskCalled('Fix the hook');
        $this->journal->run(new StartTaskCommand($first->id));
        $this->journal->run(new StartTaskCommand($second->id));
        $current = $this->app->make(AssignedTaskResolver::class);

        $this->assertSame($second->number, $current->currentForCaller()->get()->number);

        $this->journal->run(new FinishTaskCommand($second->id, 1, 'Fixed.'));

        $this->assertSame([
            "tasks.work {$first->id} 1",
            "tasks.work {$second->id} 1",
        ], $this->taskFrames());

        $this->assertSame($first->number, $current->currentForCaller()->get()->number);
    }

    #[TimeLimit(seconds: 3, reason: 'It runs four task commands through the bus, each with its stack transaction.')]
    public function test_blocking_or_cancelling_a_task_leaves_its_frame_stored_and_no_task_current(): void
    {
        $tasks = $this->writersTasks();
        $blocked = $tasks->task('Wait for review')->taskCalled('Wait for review');
        $cancelled = $tasks->task('Drop the idea')->taskCalled('Drop the idea');
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
        $tasks = $this->writersTasks();
        $first = $tasks->task('Write the walk')->taskCalled('Write the walk');
        $second = $tasks->task('Fix the hook')->taskCalled('Fix the hook');
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
     * An agent mid task: its start pushed the work state the scenario tests follow.
     */
    private function startWork(): void
    {
        $this->work = $this->journal->startScenario(AgentMidTask::class);
    }

    /**
     * The work state its start pushed for the agent's task.
     */
    private function working(): StateHandle
    {
        return $this->journal->stateOn($this->work->session, WorkOnTaskStateReference::forTask($this->work->task))
            ->given([], fn (StateObservation $state) => $state->assertLive());
    }

    /**
     * The tasks of an owner's agent Writer, who runs every task command after.
     */
    private function writersTasks(): TaskFixtures
    {
        $this->journal->owner()->agent('Writer')->actAs('Writer');

        return $this->journal->fixtures(TaskFixtures::class);
    }

    /**
     * The claim of the agent's run of its task, by this holder, with these assignments.
     *
     * @param  list<string>  $assignmentIds
     */
    private function claimed(ActorIdentity $holder, array $assignmentIds): TaskRunClaimed
    {
        return new TaskRunClaimed($this->work->task->id, $this->work->task->run_number, $holder, $assignmentIds);
    }

    private function agent(): ActorIdentity
    {
        return $this->journal->actorCalled('Writer');
    }

    private function hooks(): SessionHooks
    {
        return $this->journal->hooksFor($this->work->session);
    }

    private function toolFinished(): ToolFinished
    {
        return $this->hooks()->toolFinished();
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
