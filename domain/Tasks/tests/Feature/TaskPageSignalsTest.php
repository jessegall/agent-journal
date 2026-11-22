<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\CommandBus;
use App\Contracts\UserInterfaceUpdater;
use App\Support\Reflector;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskStartCommitted;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * Every committed change of a task, in a plan or not, sends the page signal that makes the mounted tasks views read
 * again, and a start sends it once after its commit.
 */
final class TaskPageSignalsTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

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
    ];

    public function test_a_start_outside_the_browser_sends_one_page_signal_after_its_commit(): void
    {
        Event::fake([TaskStartCommitted::class]);
        $task = Task::factory()->create();
        $this->startUserRequestAs($this->owner->id);

        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));

        Event::assertDispatchedTimes(TaskStartCommitted::class, 1);
        Event::assertDispatched(TaskStartCommitted::class, fn (TaskStartCommitted $sent) => $sent->taskId === $task->id);
    }

    public function test_the_ending_facts_of_a_task_are_page_signals(): void
    {
        foreach ([TaskFinished::class, TaskBlocked::class, TaskCancelled::class, TaskStartCommitted::class] as $fact) {
            $this->assertTrue(Reflector::of($fact)->isSubclassOf(UserInterfaceUpdater::class), $fact);
        }
    }
}
