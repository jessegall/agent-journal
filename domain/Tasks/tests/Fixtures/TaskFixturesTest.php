<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Tests\TestCase;
use PHPUnit\Framework\AssertionFailedError;
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
        $this->tasks->task('Write it')->withTask('Write it', fn (TestTask $task) => $task->assertRunCount(0));

        $task = $this->tasks->taskCalled('Write it');

        $this->assertSame([TaskStatus::Open, $this->journal->ownerUser()->id], [$task->status, $task->creator_id]);
    }

    public function test_a_created_task_is_given_back_and_still_found_by_its_name(): void
    {
        $task = $this->tasks->createTask('Write it');

        $this->assertTrue($task->is($this->tasks->taskCalled('Write it')));
    }

    public function test_a_started_run_is_claimed_by_the_named_agent_and_its_log_is_its_own(): void
    {
        $this->tasks->task('Write it')->startRun('Write it', 'Ada')->assertStarted('Write it', by: 'Ada');

        $this->journal->run(new LogTaskRunCommand($this->tasks->taskCalled('Write it')->id, 1, 'Begun.'));

        $this->tasks->withTask('Write it', fn (TestTask $task) => $task
            ->assertRunCount(1))->assertLog('Write it', 1, ['Begun.']);
    }

    public function test_a_competing_start_is_refused_and_no_second_run_exists(): void
    {
        $this->tasks->task('Write it')->startRun('Write it', 'Ada');

        $this->journal->assertRefused(TaskRunTaken::class, fn () => $this->tasks->startRun('Write it', 'Grace'));

        $this->tasks->withTask('Write it', fn (TestTask $task) => $task
            ->assertRunCount(1))->assertStarted('Write it', by: 'Ada');
    }

    public function test_a_wait_is_outstanding_until_its_prerequisite_finishes_or_it_is_waived(): void
    {
        $this->tasks->task('Design')->task('Build')->task('Ship')->waitFor(
            'Build',
            'Design',
        )->waitFor('Ship', 'Design');

        $this->tasks->withTask('Build', fn (TestTask $task) => $task
            ->assertWait('Design', isSatisfied: false))->waiveWait('Ship', 'Design', 'Not needed.');

        $this->tasks->startRun('Design', 'Ada');
        $this->journal->run(new FinishTaskCommand($this->tasks->taskCalled('Design')->id, 1, 'Done.'));

        $this->tasks->withTask('Build', fn (TestTask $task) => $task->assertWait('Design', isSatisfied: true))
            ->withTask('Ship', fn (TestTask $task) => $task->assertWait('Design', isSatisfied: true, isWaived: true));
    }

    public function test_a_task_in_a_state_stands_in_it_with_no_run_and_the_owner_as_creator(): void
    {
        $task = $this->tasks->taskIn('Blocked work', TaskStatus::Blocked)->taskCalled('Blocked work');

        $this->assertSame([TaskStatus::Blocked, $this->journal->ownerUser()->id], [$task->status, $task->creator_id]);

        $this->tasks->withTask('Blocked work', fn (TestTask $task) => $task->assertRunCount(0));
    }

    public function test_a_finished_and_a_cancelled_task_keep_their_outcome_and_reason(): void
    {
        $finished = $this->tasks->finishedTask('Shipped', 'Merged.')->taskCalled('Shipped');
        $cancelled = $this->tasks->cancelledTask('Dropped', 'Out of scope.')->taskCalled('Dropped');

        $this->assertSame(
            [TaskStatus::Finished, 'Merged.', TaskStatus::Cancelled, 'Out of scope.'],
            [$finished->status, $finished->result_note, $cancelled->status, $cancelled->cancel_reason],
        );
    }

    public function test_the_run_of_a_number_and_the_current_run_are_the_started_run(): void
    {
        $this->tasks->task('Write it')->startRun('Write it', 'Ada');

        $run = $this->tasks->runOf('Write it', 1);

        $this->assertSame([1, $run->id], [$run->run_number, $this->tasks->currentRunOf('Write it')->id]);

        $this->assertThrows(fn () => $this->tasks->runOf('Write it', 2), AssertionFailedError::class);
        $this->assertThrows(fn () => $this->tasks->task('Idle')->currentRunOf('Idle'), AssertionFailedError::class);
    }
}
