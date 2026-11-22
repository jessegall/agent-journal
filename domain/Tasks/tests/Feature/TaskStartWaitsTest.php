<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Support\PoolMembers;
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Commands\AddTaskWait;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Commands\WaiveTaskWait;
use Domain\Tasks\Exceptions\TaskWaitsUnmet;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
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
        $this->runCommand(new AddTaskWait($this->dependent->id, $this->prerequisite->id, self::key()));

        $this->assertThrows(fn () => $this->runCommand(new StartTask($this->dependent->id)), TaskWaitsUnmet::class);
        $this->assertNotContains($this->dependent->id, $this->pooled());

        $this->runCommand(new StartTask($this->prerequisite->id));
        $this->runCommand(new FinishTask($this->prerequisite->id, 1, 'Done.'));

        $this->assertContains($this->dependent->id, $this->pooled());
        $this->assertSame(1, $this->runCommand(new StartTask($this->dependent->id)));
    }

    public function test_a_waiver_makes_the_task_startable(): void
    {
        $this->runCommand(new AddTaskWait($this->dependent->id, $this->prerequisite->id, self::key()));
        $this->runCommand(
            new WaiveTaskWait($this->dependent->id, $this->prerequisite->id, self::key(), 'Done by hand.'),
        );

        $this->assertContains($this->dependent->id, $this->pooled());
        $this->assertSame(1, $this->runCommand(new StartTask($this->dependent->id)));
    }

    public function test_a_blocked_task_with_a_new_unmet_wait_cannot_restart_and_a_repeat_start_keeps_the_run(): void
    {
        $this->assertSame(1, $this->runCommand(new StartTask($this->dependent->id)));
        $this->assertSame(1, $this->runCommand(new StartTask($this->dependent->id)));

        $this->runCommand(new BlockTask($this->dependent->id, 1, 'Waits for records.'));
        $this->runCommand(new AddTaskWait($this->dependent->id, $this->prerequisite->id, self::key()));

        $this->assertThrows(fn () => $this->runCommand(new StartTask($this->dependent->id)), TaskWaitsUnmet::class);
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
        return $this->app->make(CommandBus::class)->run($command);
    }

    private static function key(): string
    {
        return (string) Str::uuid();
    }
}
