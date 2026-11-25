<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Fixtures;

use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\FixtureRefused;

/**
 * A Plans test reaches its plan fixture through the journal: plans, paused plans, numbered phases and placed tasks are
 * arranged by name, a name is taken once, and two phases with one title under two plans stay apart.
 */
final class PlanFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_journal_hands_a_plans_test_one_plan_fixture(): void
    {
        $this->assertSame($this->journal->fixtures(PlanFixtures::class), $this->journal->fixtures(PlanFixtures::class));
    }

    public function test_plans_are_arranged_planned_or_paused_and_phases_numbered_in_their_plan(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)
            ->plan('Release')
            ->pausedPlan('Later')
            ->phase('Release', 'Design')
            ->phase('Release', 'Build');

        $plans->assertStatus('Release', PlanStatus::Planned)->assertStatus('Later', PlanStatus::Paused);
        $plans->assertPhase('Design', plan: 'Release', number: 1)->assertPhase('Build', plan: 'Release', number: 2);
        $this->assertSame($this->journal->ownerUser()->id, $plans->planCalled('Release')->creator_id);
    }

    public function test_a_task_placed_in_a_phase_stands_at_its_place(): void
    {
        $this->journal->owner();
        $task = Task::create('Write it', 'The first step.', $this->journal->ownerUser())->assignmentIdentity();

        $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release')
            ->phaseWithTask('Release', 'Build', $task)
            ->assertPhaseTask('Build', $task, 1);
    }

    public function test_a_record_that_is_no_task_is_not_placed(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Release');
        $plan = $plans->planCalled('Release')->assignmentIdentity();

        $this->journal->assertRefused(FixtureRefused::class, fn () => $plans->phaseWithTask('Release', 'Build', $plan));
        $this->assertSame(0, Phase::query()->count());
    }

    public function test_two_phases_with_one_title_under_two_plans_stay_apart(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)
            ->plan('First')
            ->plan('Second')
            ->phase('First', 'First build', title: 'Build')
            ->phase('Second', 'Second build', title: 'Build');

        $plans->assertPhase('First build', plan: 'First', number: 1)->assertPhase(
            'Second build',
            plan: 'Second',
            number: 1,
        );

        $this->assertNotSame($plans->phaseCalled('First build')->id, $plans->phaseCalled('Second build')->id);
    }

    public function test_a_taken_name_or_an_unknown_plan_is_refused_before_a_row_is_written(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Release');

        $this->journal->assertRefused(FixtureRefused::class, fn () => $plans->plan('Release'));
        $this->journal->assertRefused(FixtureRefused::class, fn () => $plans->phase('Missing', 'Build'));
        $this->assertSame(1, Plan::query()->count());
        $this->assertSame(0, Phase::query()->count());
    }
}
