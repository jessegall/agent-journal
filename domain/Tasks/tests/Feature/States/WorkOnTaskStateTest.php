<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature\States;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Event;
use App\Enums\Hooks\ToolOutcome;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;
use Domain\Tasks\Support\States\WorkOnTaskState;
use Domain\Tasks\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\StateScenario;
use Tests\Support\TestActors;
use Tests\Support\TestsStates;

/**
 * The work-on-task state on the real engine, pushed by starting its task: its task finishing, blocking or being cancelled ends the run while
 * another task's end does not, and a log falls due after the tool use limit, its count starting again with a log.
 */
final class WorkOnTaskStateTest extends TestCase
{
    use TestsStates;

    private Task $task;

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
        $other = Task::factory()->create();

        $this->working()
            ->given(new $ending($other->id, TaskState::Started, 'entry-1'))
            ->assertStillActive()
            ->given(new $ending($this->task->id, TaskState::Started, 'entry-2'))
            ->assertPopped();
    }

    public function test_a_log_falls_due_after_the_tool_use_limit(): void
    {
        $scenario = $this->working();

        for ($use = 1; $use < WorkOnTaskState::LOG_DUE_AFTER; $use++) {
            $scenario->given($this->toolFinished());
        }

        $this->assertSame(WorkOnTaskState::LOG_DUE_AFTER - 1, $scenario->values()['toolUsesSinceLog']);

        $scenario->given($this->toolFinished())->assertPushed(LogDueStateReference::TYPE_KEY);

        $this->assertSame(0, $scenario->values()['toolUsesSinceLog']);
    }

    public function test_a_log_on_its_task_starts_the_count_again(): void
    {
        $scenario = $this->working()->given($this->toolFinished(), new TaskLogged($this->task->id, 'entry-1'));

        $this->assertSame(0, $scenario->values()['toolUsesSinceLog']);
    }

    /**
     * A task the agent started, which assigns it to the agent and pushes its work state.
     */
    private function working(): StateScenario
    {
        $task = Task::factory()->create();
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $this->task = $task->refresh();

        return $this->scenarioOn(WorkOnTaskStateReference::forTask($this->task))->assertStillActive();
    }

    private function toolFinished(): ToolFinished
    {
        return new ToolFinished(
            TestActors::hookIdentity(1, 10, 'call-1', self::inputDigest()),
            new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => 'ls'])),
        );
    }
}
