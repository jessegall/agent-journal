<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\States;

use App\Contracts\Events\Event;
use App\Support\Inputs\ToolFinished;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;
use Domain\Tasks\Support\States\WorkOnTaskState;
use Domain\Tasks\Tests\Fixtures\AgentMidTask;
use Domain\Tasks\Tests\Fixtures\RunningTask;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;

/**
 * The work-on-task state on the real engine, pushed by starting its task: its task finishing, blocking or being cancelled ends the run while
 * another task's end does not, and a log falls due after the tool use limit, its count starting again with a log.
 */
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
        'command_receipts',
    ];

    private RunningTask $work;

    protected function setUp(): void
    {
        parent::setUp();

        $this->work = $this->journal->startScenario(AgentMidTask::class);
    }

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
     * @param  class-string<TaskFinished|TaskBlocked|TaskCancelled>  $ending
     */
    #[DataProvider('endings')]
    public function test_its_task_ending_ends_the_run_and_another_tasks_does_not(string $ending): void
    {
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

    public function test_a_log_falls_due_after_the_tool_use_limit(): void
    {
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
        $this->working()->given(
            [
                $this->toolFinished(),
                new TaskLogged($this->work->task->id, 'entry-1'),
            ],
            fn (StateObservation $state) => $state->assertValue('toolUsesSinceLog', 0),
        );
    }

    /**
     * The work state its start pushed for the agent's task.
     */
    private function working(): StateHandle
    {
        return $this->journal->stateOn($this->work->session, WorkOnTaskStateReference::forTask($this->work->task))
            ->given([], fn (StateObservation $state) => $state->assertLive());
    }

    private function toolFinished(): ToolFinished
    {
        return $this->journal->hooksFor($this->work->session)->toolFinished();
    }
}
