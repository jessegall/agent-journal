<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Events\TaskStartCommitted;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;

/**
 * Every committed change of a task, in a plan or not, sends the page signal that makes the mounted tasks views read
 * again, and a start sends it once after its commit.
 */
final class TaskPageSignalsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_start_outside_the_browser_sends_one_page_signal_after_its_commit(): void
    {
        Event::fake([TaskStartCommitted::class]);
        $task = $this->tasks()->task('task')->taskCalled('task');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        Event::assertDispatchedTimes(TaskStartCommitted::class, 1);

        Event::assertDispatched(
            TaskStartCommitted::class,
            fn (TaskStartCommitted $sent) => $sent->taskId === $task->id,
        );
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
