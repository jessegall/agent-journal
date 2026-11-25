<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Tasks arranged by name through the journal: a task is open until a named agent starts it, the run is claimed by that
 * agent, a competing start is refused with no second run, and waits are met, outstanding or waived.
 */
final class TaskFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    private TaskFixtures $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Ada')->agent('Grace', 'read-only-helper');
        $this->tasks = $this->journal->fixtures(TaskFixtures::class);
    }

    public function test_a_task_is_open_and_owned_by_the_owner_until_it_is_started(): void
    {
        $this->tasks->task('Write it')->assertRunCount('Write it', 0);

        $task = $this->tasks->taskCalled('Write it');
        $this->assertSame([TaskStatus::Open, $this->journal->ownerUser()->id], [$task->status, $task->creator_id]);
    }

    public function test_a_started_run_is_claimed_by_the_named_agent_and_its_log_is_its_own(): void
    {
        $this->tasks->task('Write it')->startRun('Write it', 'Ada')->assertStarted('Write it', by: 'Ada');

        $this->journal->run(new LogTaskRunCommand($this->tasks->taskCalled('Write it')->id, 1, 'Begun.'));

        $this->tasks->assertRunCount('Write it', 1)->assertLog('Write it', 1, ['Begun.']);
    }

    public function test_a_competing_start_is_refused_and_no_second_run_exists(): void
    {
        $this->tasks->task('Write it')->startRun('Write it', 'Ada');

        $this->journal->assertRefused(TaskRunTaken::class, fn () => $this->tasks->startRun('Write it', 'Grace'));

        $this->tasks->assertRunCount('Write it', 1)->assertStarted('Write it', by: 'Ada');
    }

    public function test_a_wait_is_outstanding_until_its_prerequisite_finishes_or_it_is_waived(): void
    {
        $this->tasks->task('Design')->task('Build')->task('Ship')->waitFor(
            'Build',
            'Design',
        )->waitFor('Ship', 'Design');
        $this->tasks->assertWait('Build', 'Design', isSatisfied: false)->waiveWait('Ship', 'Design', 'Not needed.');

        $this->tasks->startRun('Design', 'Ada');
        $this->journal->run(new FinishTaskCommand($this->tasks->taskCalled('Design')->id, 1, 'Done.'));

        $this->tasks->assertWait('Build', 'Design', isSatisfied: true)
            ->assertWait('Ship', 'Design', isSatisfied: true, isWaived: true);
    }
}
