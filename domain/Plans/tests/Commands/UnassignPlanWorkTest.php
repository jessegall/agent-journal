<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Commands\UnassignPlanWork\UnassignPlanWorkCommand;
use Domain\Plans\Models\Phase;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\Fixtures\TestPhase;
use Domain\Plans\Tests\Fixtures\TestPlan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A user takes back a phase's work given out at once: the phase and its tasks lose their holder together.
 */
#[TestsCommand(UnassignPlanWorkCommand::class)]
final class UnassignPlanWorkTest extends TestCase
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

    private Phase $working;

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
            ->withPlan('Release', fn (TestPlan $plan) => $plan
                ->addPhase('Working')->withPhase('Working', fn (TestPhase $phase) => $phase
                ->place($tasks->taskCalled('Open')->assignmentIdentity()))->addPhase('Over'))
            ->withPhase('Over', fn (TestPhase $phase) => $phase
                ->place(
                    $tasks->taskCalled('Finished')->assignmentIdentity(),
                    $tasks->taskCalled('Cancelled')->assignmentIdentity(),
                ))
            ->withPlan('Release', fn (TestPlan $plan) => $plan->addPhase('Empty'));

        $this->working = $plans->phaseCalled('Working');
    }

    public function test_a_phase_cascade_covers_that_phase_and_its_tasks_only_and_releasing_it_clears_them(): void
    {
        $root = $this->assignWork($this->working->assignmentIdentity(), $this->builder)->outcomes[0]->current;

        $this->assertEqualsCanonicalizing([Phase::linkType(), 'tasks.task'], $this->heldTypes());

        $this->unassignWork($this->working->assignmentIdentity(), $root->reference);

        $this->assertSame(0, AssignmentRecord::query()->count());
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

    private function unassignWork(RecordIdentity $root, AssignmentReference $expectedRoot): AssignmentResult
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new UnassignPlanWorkCommand($root, $expectedRoot));
    }
}
