<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Processes\RunClaims;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\SeedsJournal;

/**
 * An agent starts a task: it opens the task's first run, claimed by the agent, and a retry under the same key gets
 * that run; another agent is refused while it runs, and a task that ended is not started again.
 */
final class StartTaskTest extends TestCase
{
    use CommitsHookRows;
    use SeedsJournal;

    private const array TABLES = ['tasks', 'task_runs', 'claim_authorizations'];

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal()->owner()->agent('First')->agent('Second', 'read-only-helper');
        $this->task = Task::create('Owned work', 'Build it.', $this->journal()->ownerUser());
    }

    public function test_a_start_opens_one_run_claimed_by_the_agent_and_a_keyed_retry_gets_it(): void
    {
        $this->journal()->actAs('First');

        $run = $this->journal()->run(new StartTaskCommand($this->task->id), '01JD8X0G9M3QZ6V4K2STARTKEY1');
        $retry = $this->journal()->run(new StartTaskCommand($this->task->id), '01JD8X0G9M3QZ6V4K2STARTKEY1');

        $this->assertSame([1, 1, TaskStatus::Started], [$run, $retry, $this->task->refresh()->status]);
        $taskRun = TaskRun::query()->where('task_id', $this->task->id)->sole();
        $holder = $this->app->make(RunClaims::class)->holderOf($taskRun->assignmentIdentity())->get();
        $this->assertSame($this->journal()->agentCalled('First')->id, $holder->id);
    }

    public function test_another_agent_is_refused_while_the_task_runs(): void
    {
        $this->journal()->actAs('First')->run(new StartTaskCommand($this->task->id));

        $this->assertThrows(
            fn () => $this->journal()->actAs('Second')->run(new StartTaskCommand($this->task->id)),
            TaskRunTaken::class,
        );
    }

    public function test_a_task_that_ended_is_not_started_again(): void
    {
        $run = $this->journal()->actAs('First')->run(new StartTaskCommand($this->task->id));
        $this->journal()->run(new FinishTaskCommand($this->task->id, $run, 'Done.'));

        $this->assertThrows(
            fn () => $this->journal()->run(new StartTaskCommand($this->task->id)),
            TaskRestartRefused::class,
        );
    }
}
