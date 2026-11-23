<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Commands\ApplyTaskWaits\ApplyTaskWaitsCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Exceptions\TaskGraphChanged;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphVersion;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskWaitPair;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;

/**
 * Doc 106, section 4: several waits change at once only against the graph version they were read at, and any change
 * the batch cannot make leaves every wait as it was.
 */
final class ApplyTaskWaitsTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use RunsKeyedCommands;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
        'task_waits',
        'task_wait_history',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    /**
     * @var list<Task>
     */
    private array $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tasks = array_map(
            fn (int $place) => Task::factory()->create(['title' => "Step {$place}"]),
            [1, 2, 3, 4],
        );
        $this->startUserRequestAs($this->owner->id);
        $this->runOnBus(new AddTaskWaitCommand($this->tasks[1]->id, $this->tasks[0]->id));
        $this->runOnBus(new AddTaskWaitCommand($this->tasks[2]->id, $this->tasks[0]->id));
    }

    public function test_one_apply_changes_exactly_its_waits_under_one_batch(): void
    {
        $version = $this->runOnBus(new ApplyTaskWaitsCommand(
            $this->ids(),
            $this->version(),
            [$this->pair(3, 2)],
            [$this->pair(1, 0), $this->pair(2, 0)],
        ));

        $this->assertSame([[$this->tasks[3]->id, $this->tasks[2]->id]], $this->waits());
        $this->assertSame($this->version(), $version);
        $batches = TaskWaitHistory::query()->whereNotNull('batch_id')->pluck('batch_id')->all();
        $this->assertCount(3, $batches);
        $this->assertCount(1, array_unique($batches));
    }

    public function test_a_graph_changed_since_it_was_read_refuses_the_whole_batch(): void
    {
        $read = $this->version();
        $this->runOnBus(new AddTaskWaitCommand($this->tasks[3]->id, $this->tasks[0]->id));

        $this->assertThrows(
            fn () => $this->runOnBus(new ApplyTaskWaitsCommand($this->ids(), $read, [], [$this->pair(1, 0)])),
            TaskGraphChanged::class,
        );

        $this->assertCount(3, $this->waits());
    }

    public function test_a_wait_that_would_close_a_cycle_refuses_the_whole_batch(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new ApplyTaskWaitsCommand(
                $this->ids(),
                $this->version(),
                [$this->pair(0, 1)],
                [$this->pair(2, 0)],
            )),
            TaskWaitRefused::class,
        );

        $this->assertCount(2, $this->waits());
    }

    public function test_a_wait_on_an_ended_task_refuses_the_whole_batch(): void
    {
        $this->runOnBus(new CancelTaskCommand($this->tasks[3]->id, 'Not needed.'));

        $this->assertThrows(
            fn () => $this->runOnBus(new ApplyTaskWaitsCommand(
                $this->ids(),
                $this->version(),
                [$this->pair(3, 2)],
                [$this->pair(1, 0)],
            )),
            TaskWaitRefused::class,
        );

        $this->assertCount(2, $this->waits());
    }

    /**
     * @return list<string>
     */
    private function ids(): array
    {
        return array_map(fn (Task $task) => $task->id, $this->tasks);
    }

    private function version(): string
    {
        return $this->app->make(TaskGraphVersion::class)->current($this->ids());
    }

    private function pair(int $dependent, int $prerequisite): TaskWaitPair
    {
        return new TaskWaitPair($this->tasks[$dependent]->id, $this->tasks[$prerequisite]->id);
    }

    /**
     * @return list<array{string, string}>
     */
    private function waits(): array
    {
        return TaskWait::query()->orderBy('created_at')->get()
            ->map(fn (TaskWait $wait) => [$wait->dependent_task_id, $wait->prerequisite_task_id])->all();
    }
}
