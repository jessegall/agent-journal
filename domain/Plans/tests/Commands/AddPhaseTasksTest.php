<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Plans\Values\PlanProgress;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
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
        'task_runs',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'inboxes',
        'inbox_members',
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

    public function test_placing_starting_finishing_and_cancelling_moves_the_phase_and_plan_tallies(): void
    {
        $plan = $this->plans()->plan('plan')->planCalled('plan');
        $phase = $this->structure()->addPhase($plan, 'Work');
        [$first, $second, $third] = Task::factory()->count(3)->create()->all();
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->structure()->addTasks($phase, [
            $first->id,
            $second->id,
            $third->id,
        ]);

        $this->runCommand(new StartTaskCommand($first->id));
        $this->runCommand(new StartTaskCommand($second->id));
        $this->runCommand(new FinishTaskCommand($second->id, 1, 'Done.'));
        $this->runCommand(new CancelTaskCommand($third->id, 'Not needed.'));

        foreach ([
            $phase->refresh()->progress,
            $plan->refresh()->progress,
        ] as $progress) {
            $this->assertSame(
                [
                    'total' => 3,
                    'finished' => 1,
                    'cancelled' => 1,
                    'started' => 1,
                    'blocked' => 0,
                    'unfinished' => 1,
                ],
                self::tallies($progress),
            );
        }

        $this->runCommand(new CancelTaskCommand($first->id, 'Dropped.'));

        $this->assertSame(
            [
                'total' => 3,
                'finished' => 1,
                'cancelled' => 2,
                'started' => 0,
                'blocked' => 0,
                'unfinished' => 0,
            ],
            self::tallies($phase->refresh()->progress),
        );
    }

    private function phaseId(): string
    {
        return $this->plans->phaseCalled('Read')->id;
    }

    private function structure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    /**
     * @return array<string, int>
     */
    private static function tallies(PlanProgress $progress): array
    {
        return [
            'total' => $progress->total,
            'finished' => $progress->finished,
            'cancelled' => $progress->cancelled,
            'started' => $progress->started,
            'blocked' => $progress->blocked,
            'unfinished' => $progress->unfinished(),
        ];
    }

    private function runCommand(object $command): void
    {
        $this->app->make(CommandBus::class)->run($command);
    }

    private function plans(): PlanFixtures
    {
        return $this->journal->fixtures(PlanFixtures::class);
    }
}
