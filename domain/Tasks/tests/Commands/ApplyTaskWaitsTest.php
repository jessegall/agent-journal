<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Commands\ApplyTaskWaits\ApplyTaskWaitsCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Exceptions\TaskGraphChanged;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphVersion;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskWaitPair;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * Several waits change at once only against the graph version they were read at, and any change
 * the batch cannot make leaves every wait as it was.
 */
#[TestsCommand(ApplyTaskWaitsCommand::class)]
final class ApplyTaskWaitsTest extends TestCase
{
    use CommitsHookRows;

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
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    /**
     * @var list<Task>
     */
    private array $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->tasks = array_map(
            fn (int $place) => $this->tasks()->task("Step {$place}")->taskCalled("Step {$place}"),
            [
                1,
                2,
                3,
                4,
            ],
        );

        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->journal->run(new AddTaskWaitCommand($this->tasks[1]->id, $this->tasks[0]->id));
        $this->journal->run(new AddTaskWaitCommand($this->tasks[2]->id, $this->tasks[0]->id));
    }

    public function test_one_apply_changes_exactly_its_waits_under_one_batch(): void
    {
        $version = $this->journal->run(new ApplyTaskWaitsCommand(
            $this->ids(),
            $this->version(),
            [$this->pair(3, 2)],
            [
                $this->pair(1, 0),
                $this->pair(2, 0),
            ],
        ));

        $this->assertSame([[
            $this->tasks[3]->id,
            $this->tasks[2]->id,
        ]], $this->waits());

        $this->assertSame($this->version(), $version);
        $batches = TaskWaitHistory::query()->whereNotNull('batch_id')->pluck('batch_id')->all();
        $this->assertCount(3, $batches);
        $this->assertCount(1, array_unique($batches));
    }

    public function test_a_graph_changed_since_it_was_read_refuses_the_whole_batch(): void
    {
        $read = $this->version();
        $this->journal->run(new AddTaskWaitCommand($this->tasks[3]->id, $this->tasks[0]->id));

        $this->assertThrows(
            fn () => $this->journal->run(new ApplyTaskWaitsCommand($this->ids(), $read, [], [$this->pair(1, 0)])),
            TaskGraphChanged::class,
        );

        $this->assertCount(3, $this->waits());
    }

    public function test_a_wait_that_would_close_a_cycle_refuses_the_whole_batch(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new ApplyTaskWaitsCommand(
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
        $this->journal->run(new CancelTaskCommand($this->tasks[3]->id, 'Not needed.'));

        $this->assertThrows(
            fn () => $this->journal->run(new ApplyTaskWaitsCommand(
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
            ->map(fn (TaskWait $wait) => [
                $wait->dependent_task_id,
                $wait->prerequisite_task_id,
            ])->all();
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
