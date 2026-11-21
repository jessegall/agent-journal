<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ActiveEventUnits;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Events\Dispatcher;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * Two worker lifecycles one after the other, the first failing: the failed command leaves no unit open and no fact
 * behind, and the second lifecycle releases only its own facts.
 */
final class WorkerLifecycleFactsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'tasks',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
    ];

    public function test_a_failed_lifecycle_leaves_the_next_one_an_empty_unit_and_only_its_own_facts(): void
    {
        $facts = [];

        $this->app->make(Dispatcher::class)->listen(
            [TaskFinished::class, TaskCancelled::class],
            function (object $fact) use (&$facts): void {
                $facts[] = $fact::class;
            },
        );

        $task = Task::factory()->create(['title' => 'Kept']);
        $this->startUserRequestAs(TestIds::of(7));

        $this->assertThrows(fn () => $this->app->make(CommandBus::class)->run(new FinishTask($task->id, 9, 'Done.')));

        $this->app->forgetScopedInstances();
        $units = $this->app->make(ActiveEventUnits::class);
        $this->assertTrue($units->activeFor($this->app->make(ConnectionInterface::class))->isEmpty());
        $this->startUserRequestAs(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new CancelTask($task->id, 'Dropped.'));

        $this->assertSame([TaskCancelled::class], $facts);
    }
}
