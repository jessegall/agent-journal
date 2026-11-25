<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Tests\Fixtures\StartNamedTask;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * An agent starts a task: it opens the task's first run, claimed by the agent, and a retry under the same key gets
 * that run; another agent is refused while it runs, and a task that ended is not started again.
 */
final class StartTaskTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
        'assignments',
        'agent_stacks',
        'command_receipts',
    ];

    private const string START_KEY = '01JD8X0G9M3QZ6V4K2STARTKEY1';

    private TaskFixtures $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('First')->agent('Second', 'read-only-helper');
        $this->tasks = $this->journal->fixtures(TaskFixtures::class)->task('Owned work', 'Build it.');
    }

    public function test_a_start_opens_one_run_claimed_by_the_agent_and_a_keyed_retry_gets_it(): void
    {
        $start = new StartTaskCommand($this->tasks->taskCalled('Owned work')->id);

        $run = $this->journal->actAs('First')->run($start, self::START_KEY);
        $retry = $this->journal->run($start, self::START_KEY);

        $this->assertSame([1, 1], [$run, $retry]);
        $this->tasks->assertStarted('Owned work', by: 'First')->assertRunCount('Owned work', 1);
    }

    public function test_another_agent_is_refused_while_the_task_runs(): void
    {
        $work = $this->journal->startScenario(new StartNamedTask(owner: 'Owner', worker: 'First', task: 'Draft'));

        $this->journal->actAs('Second')->assertRefused(
            TaskRunTaken::class,
            fn () => $this->journal->run(new StartTaskCommand($work->task->id)),
        );

        $this->tasks->assertStarted('Draft', by: 'First')->assertRunCount('Draft', 1);
    }

    public function test_a_task_that_ended_is_not_started_again(): void
    {
        $work = $this->journal->startScenario(new StartNamedTask(owner: 'Owner', worker: 'First', task: 'Draft'));
        $this->journal->run(new FinishTaskCommand($work->task->id, $work->run->run_number, 'Done.'));

        $this->journal->assertRefused(
            TaskRestartRefused::class,
            fn () => $this->journal->run(new StartTaskCommand($work->task->id)),
        );
    }
}
