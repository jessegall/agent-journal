<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * Plans puts tasks into phases by id, after Tasks confirmed they exist.
 */
final class AddPhaseTasksTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits AddPhaseTasksCommand for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'users',
        'number_groups',
        'command_receipts',
    ];

    private PlanFixtures $plans;

    private TaskFixtures $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->plans = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Build')->phase('Build', 'Read');
        $this->tasks = $this->journal->fixtures(TaskFixtures::class)->task('First')->task('Second');
    }

    public function test_tasks_join_a_phase_in_order_once_tasks_confirmed_them(): void
    {
        [$first, $second] = [$this->tasks->taskCalled('First'), $this->tasks->taskCalled('Second')];

        $this->journal->run(new AddPhaseTasksCommand($this->phaseId(), 1, [$second->id, $first->id]));

        $this->plans->assertPhaseTask('Read', $second->assignmentIdentity(), 1)
            ->assertPhaseTask('Read', $first->assignmentIdentity(), 2);
    }

    public function test_one_missing_task_refuses_the_whole_addition(): void
    {
        $real = $this->tasks->taskCalled('First')->id;

        $this->journal->assertRefused(
            TaskMissing::class,
            fn () => $this->journal->run(new AddPhaseTasksCommand($this->phaseId(), 1, [$real, TestIds::of(999999)])),
        );

        $this->assertSame([], $this->plans->phaseCalled('Read')->taskIds());
    }

    public function test_a_task_named_twice_is_refused_before_anything_is_written(): void
    {
        $task = $this->tasks->taskCalled('First')->id;

        $this->journal->assertRefused(
            TaskAlreadyInAPhase::class,
            fn () => $this->journal->run(new AddPhaseTasksCommand($this->phaseId(), 1, [$task, $task])),
            fn (TaskAlreadyInAPhase $refusal) => $this->assertEquals(TaskAlreadyInAPhase::forTask($task), $refusal),
        );

        $this->assertSame([], $this->plans->phaseCalled('Read')->taskIds());
    }

    private function phaseId(): string
    {
        return $this->plans->phaseCalled('Read')->id;
    }
}
