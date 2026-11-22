<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Assignments\AssignmentQuery;
use App\Support\PoolMembers;
use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Commands\WaiveTaskWait\WaiveTaskWaitCommand;
use Domain\Tasks\Exceptions\TaskWaitsUnmet;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;

/**
 * A task with a wait not met cannot be started by anyone and is not in the pool; finishing the prerequisite or
 * waiving the wait makes it startable again; a blocked task with a new unmet wait cannot restart; a repeat start of a
 * running task keeps its run.
 */
final class TaskStartWaitsTest extends TestCase
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

    private Task $prerequisite;

    private Task $dependent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->prerequisite = Task::factory()->create(['title' => 'Prepare records']);
        $this->dependent = Task::factory()->create(['title' => 'Publish records']);
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_an_unmet_wait_keeps_the_task_out_of_starts_and_the_pool_until_its_prerequisite_finishes(): void
    {
        $this->runCommand(new AddTaskWaitCommand($this->dependent->id, $this->prerequisite->id));

        $this->assertThrows(fn () => $this->runCommand(new StartTaskCommand($this->dependent->id)), TaskWaitsUnmet::class);
        $this->assertNotContains($this->dependent->id, $this->pooled());

        $this->runCommand(new StartTaskCommand($this->prerequisite->id));
        $this->runCommand(new FinishTaskCommand($this->prerequisite->id, 1, 'Done.'));

        $this->assertContains($this->dependent->id, $this->pooled());
        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));
    }

    public function test_a_waiver_makes_the_task_startable(): void
    {
        $this->runCommand(new AddTaskWaitCommand($this->dependent->id, $this->prerequisite->id));

        $this->runCommand(
            new WaiveTaskWaitCommand($this->dependent->id, $this->prerequisite->id, 'Done by hand.'),
        );

        $this->assertContains($this->dependent->id, $this->pooled());
        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));
    }

    public function test_a_blocked_task_with_a_new_unmet_wait_cannot_restart_and_a_repeat_start_keeps_the_run(): void
    {
        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));
        $this->assertSame(1, $this->runCommand(new StartTaskCommand($this->dependent->id)));

        $this->runCommand(new BlockTaskCommand($this->dependent->id, 1, 'Waits for records.'));
        $this->runCommand(new AddTaskWaitCommand($this->dependent->id, $this->prerequisite->id));

        $this->assertThrows(fn () => $this->runCommand(new StartTaskCommand($this->dependent->id)), TaskWaitsUnmet::class);
    }

    /**
     * @return list<string>
     */
    private function pooled(): array
    {
        return Task::candidates(
            PoolMembers::all(),
            $this->app->make(AssignmentQuery::class)->assignedIds(TaskType::VALUE),
            50,
        )->ids;
    }

    private function runCommand(object $command): mixed
    {
        return $this->runOnBus($command);
    }
}
