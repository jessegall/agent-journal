<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Models\Access\User;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A user hands a phase's work given out at once to another holder: the phase and its open tasks move to them
 * together.
 */
#[TestsCommand(ReassignPlanWorkCommand::class)]
final class ReassignPlanWorkTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'agent_stacks',
        'inboxes',
        'inbox_members',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'assignments',
        'number_groups',
        'command_receipts',
    ];

    private AssigneeIdentity $builder;

    private Plan $plan;

    private Phase $working;

    private Phase $over;

    private Phase $empty;

    private Task $open;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->idleAgent('Builder', 'read-only-helper');
        $this->builder = AssigneeIdentity::of($this->journal->agentCalled('Builder'));

        $tasks = $this->journal->fixtures(TaskFixtures::class)
            ->task('Open')
            ->finishedTask('Finished')
            ->cancelledTask('Cancelled');

        $plans = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release')
            ->phaseWithTask('Release', 'Working', $tasks->taskCalled('Open')->assignmentIdentity())
            ->phase('Release', 'Over')
            ->placeTasks(
                'Over',
                $tasks->taskCalled('Finished')->assignmentIdentity(),
                $tasks->taskCalled('Cancelled')->assignmentIdentity(),
            )
            ->phase('Release', 'Empty');

        $this->plan = $plans->planCalled('Release');
        $this->open = $tasks->taskCalled('Open');

        [$this->working, $this->over, $this->empty] = [
            $plans->phaseCalled('Working'),
            $plans->phaseCalled('Over'),
            $plans->phaseCalled('Empty'),
        ];
    }

    public function test_a_phase_cascade_moves_to_the_new_holder_with_its_tasks(): void
    {
        $root = $this->assignWork($this->working->assignmentIdentity(), $this->builder)->outcomes[0]->current;

        $reviewer = AssigneeIdentity::of(
            $this->journal->idleAgent('Reviewer', 'read-only-helper')->agentCalled('Reviewer'),
        );

        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $this->app->make(CommandBus::class)->run(
            new ReassignPlanWorkCommand($this->working->assignmentIdentity(), $root->reference, $reviewer),
        );

        $this->assertSame([$reviewer->id, $reviewer->id], AssignmentRecord::query()->pluck('holder_id')->all());
    }

    /**
     * @return list<string>
     */
    private function heldTypes(): array
    {
        return array_values(AssignmentRecord::query()->pluck('record_type')->all());
    }

    private function assignWork(RecordIdentity $root, AssigneeIdentity $recipient): AssignmentResult
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new AssignPlanWorkCommand($root, $recipient));
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
