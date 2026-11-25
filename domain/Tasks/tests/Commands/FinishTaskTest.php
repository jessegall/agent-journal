<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\CommandInputInvalid;
use App\Support\ActiveEventUnits;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * The agent that runs a task finishes it with its note and works on it no more; another agent is refused, and a note
 * past its limit is refused before the run ends.
 */
final class FinishTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
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

    private Task $task;

    private int $run;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('First')->agent('Second', 'read-only-helper');
        $this->task = $this->tasks()->task('Owned work', 'Build it.')->taskCalled('Owned work');
        $this->run = $this->journal->actAs('First')->run(new StartTaskCommand($this->task->id));
    }

    public function test_the_runner_finishes_with_its_note_and_works_on_it_no_more(): void
    {
        $this->journal->run(new FinishTaskCommand($this->task->id, $this->run, 'Built and tested.'));

        $this->assertSame(
            [
                TaskStatus::Finished,
                'Built and tested.',
            ],
            [
                $this->task->refresh()->status,
                $this->task->result_note,
            ],
        );

        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    public function test_another_agent_and_a_note_past_its_limit_are_refused_and_the_task_still_runs(): void
    {
        $longNote = str_repeat('é', Task::NOTE_CHARACTER_LIMIT + 1);

        $this->assertThrows(
            fn () => $this->journal->run(new FinishTaskCommand($this->task->id, $this->run, $longNote)),
            CommandInputInvalid::class,
            'note:',
        );

        $this->assertThrows(
            fn () => $this->journal->actAs('Second')->run(new FinishTaskCommand($this->task->id, $this->run, 'Mine.')),
            ActorNotAllowed::class,
        );

        $this->assertSame(TaskStatus::Started, $this->task->refresh()->status);
    }

    public function test_a_failed_lifecycle_leaves_the_next_one_an_empty_unit_and_only_its_own_facts(): void
    {
        $facts = [];

        $this->app->make(Dispatcher::class)->listen(
            [
                TaskFinished::class,
                TaskCancelled::class,
            ],
            function (object $fact) use (&$facts): void {
                $facts[] = $fact::class;
            },
        );

        $task = Task::factory()->create(['title' => 'Kept']);
        $this->journal->actAsUserId(TestIds::of(7));

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new FinishTaskCommand($task->id, 9, 'Done.')),
        );

        $this->app->forgetScopedInstances();
        $units = $this->app->make(ActiveEventUnits::class);
        $this->assertTrue($units->activeFor($this->app->make(ConnectionInterface::class))->isEmpty());
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new CancelTaskCommand($task->id, 'Dropped.'));

        $this->assertSame([TaskCancelled::class], $facts);
    }

    public function test_finish_block_and_cancel_each_announce_their_change_once(): void
    {
        Event::fake([
            TaskFinished::class,
            TaskBlocked::class,
            TaskCancelled::class,
        ]);

        $this->journal->actAsUserId(TestIds::of(7));

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
        Event::fake([
            TaskFinished::class,
            TaskBlocked::class,
            TaskCancelled::class,
        ]);

        $this->journal->actAsUserId(TestIds::of(7));

        $this->expectExceptionObject(TaskMissing::forId(TestIds::of(999999)));

        try {
            $this->app->make(CommandBus::class)->run(new FinishTaskCommand(TestIds::of(999999), 0, 'Done.'));
        } finally {
            Event::assertNotDispatched(TaskFinished::class);
        }
    }

    public function test_another_runs_finish_is_refused_and_nothing_is_announced(): void
    {
        Event::fake([
            TaskFinished::class,
            TaskBlocked::class,
            TaskCancelled::class,
        ]);

        $this->journal->actAsUserId(TestIds::of(7));

        $task = $this->task('Taken');

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new FinishTaskCommand($task->id, 3, 'Done.')),
        );

        $this->assertSame(TaskStatus::Open, $task->fresh()?->status);
        Event::assertNotDispatched(TaskFinished::class);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }

    private function task(string $title): Task
    {
        return $this->tasks()->task($title)->taskCalled($title);
    }
}
