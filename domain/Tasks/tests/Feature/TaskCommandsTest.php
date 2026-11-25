<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * The Tasks commands on the bus: finish, block and cancel announce their change once it committed,
 * a task nobody has is refused with nothing written, and a start needs a session the actor may see.
 */
final class TaskCommandsTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the Tasks commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'tasks',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'users',
        'number_groups',
        'command_receipts',
        'inboxes',
        'inbox_members',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Event::fake([
            TaskFinished::class,
            TaskBlocked::class,
            TaskCancelled::class,
        ]);
        $this->journal->actAsUserId(TestIds::of(7));
    }

    public function test_finish_block_and_cancel_each_announce_their_change_once(): void
    {
        $bus = $this->app->make(CommandBus::class);
        [$finished, $blocked, $cancelled] = [
            $this->task('Finish'),
            $this->task('Block'),
            $this->task('Cancel'),
        ];

        $bus->run(new StartTaskCommand($blocked->id));
        $bus->run(new FinishTaskCommand($finished->id, 0, 'Done.'));
        $bus->run(new BlockTaskCommand($blocked->id, $blocked->refresh()->run_number, 'Waits.'));
        $bus->run(new CancelTaskCommand($cancelled->id, 'Dropped.'));

        $this->assertSame(
            [
                TaskStatus::Finished,
                TaskStatus::Blocked,
                TaskStatus::Cancelled,
            ],
            [
                $finished->fresh()?->status,
                $blocked->fresh()?->status,
                $cancelled->fresh()?->status,
            ],
        );

        Event::assertDispatchedTimes(TaskFinished::class, 1);
        Event::assertDispatchedTimes(TaskBlocked::class, 1);
        Event::assertDispatchedTimes(TaskCancelled::class, 1);
    }

    public function test_a_task_nobody_has_is_refused_and_nothing_is_announced(): void
    {
        $this->expectExceptionObject(TaskMissing::forId(TestIds::of(999999)));

        try {
            $this->app->make(CommandBus::class)->run(new FinishTaskCommand(TestIds::of(999999), 0, 'Done.'));
        } finally {
            Event::assertNotDispatched(TaskFinished::class);
        }
    }

    public function test_a_task_finished_outside_a_command_keeps_its_fact_on_itself_and_sends_nothing(): void
    {
        $task = $this->task('Bare');

        $task->finish('Done.');

        $raised = $task->takeRaisedEvents();

        $this->assertCount(1, $raised);
        $this->assertInstanceOf(TaskFinished::class, $raised[0]);
        $this->assertSame([
            $task->id,
            TaskStatus::Open,
        ], [
            $raised[0]->taskId,
            $raised[0]->previousState,
        ]);
        Event::assertNotDispatched(TaskFinished::class);
    }

    public function test_another_runs_finish_is_refused_and_nothing_is_announced(): void
    {
        $task = $this->task('Taken');

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new FinishTaskCommand($task->id, 3, 'Done.')),
        );

        $this->assertSame(TaskStatus::Open, $task->fresh()?->status);
        Event::assertNotDispatched(TaskFinished::class);
    }

    private function task(string $title): Task
    {
        return $this->tasks()->task($title)->taskCalled($title);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
