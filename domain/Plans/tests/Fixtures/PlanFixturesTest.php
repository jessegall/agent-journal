<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Fixtures;

use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\TestProjects;

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
            ->withPlan('Release', fn (TestPlan $plan) => $plan->addPhase('Design')->addPhase('Build'));

        $plans->assertStatus('Release', PlanStatus::Planned)->assertStatus('Later', PlanStatus::Paused);

        $plans
            ->withPhase('Design', fn (TestPhase $phase) => $phase->assertNumberIn($plans->planCalled('Release'), 1))
            ->withPhase('Build', fn (TestPhase $phase) => $phase->assertNumberIn($plans->planCalled('Release'), 2));

        $this->assertSame($this->journal->ownerUser()->id, $plans->planCalled('Release')->creator_id);
    }

    public function test_a_created_plan_is_given_back_and_still_found_by_its_name(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class);

        $this->assertTrue($plans->createPlan('Release')->is($plans->planCalled('Release')));
    }

    public function test_a_task_placed_in_a_phase_stands_at_its_place(): void
    {
        $this->journal->owner();

        $task = Task::create(
            'Write it',
            'The first step.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();

        $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release')
            ->withPlan('Release', fn (TestPlan $plan) => $plan
                ->addPhase('Build')->withPhase('Build', fn (TestPhase $phase) => $phase->place($task)))
            ->withPhase('Build', fn (TestPhase $phase) => $phase->assertTask($task, 1));
    }

    public function test_a_record_that_is_no_task_is_not_placed(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Release');
        $plan = $plans->planCalled('Release')->assignmentIdentity();

        $this->journal->assertRefused(FixtureRefused::class, fn () => $plans->withPlan('Release', fn (
            TestPlan $release,
        ) => $release
            ->addPhase('Build')
            ->withPhase('Build', fn (TestPhase $phase) => $phase->place($plan))));

        $this->assertSame(0, Phase::query()->count());
    }

    public function test_two_phases_with_one_title_under_two_plans_stay_apart(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)
            ->plan('First')
            ->plan('Second')
            ->withPlan('First', fn (TestPlan $first) => $first->addPhase('First build', title: 'Build'))
            ->withPlan('Second', fn (TestPlan $second) => $second->addPhase('Second build', title: 'Build'));

        $plans
            ->withPhase('First build', fn (TestPhase $phase) => $phase->assertNumberIn($plans->planCalled('First'), 1))
            ->withPhase('Second build', fn (TestPhase $phase) => $phase
                ->assertNumberIn($plans->planCalled('Second'), 1));

        $this->assertNotSame($plans->phaseCalled('First build')->id, $plans->phaseCalled('Second build')->id);
    }

    public function test_a_taken_name_or_an_unknown_plan_is_refused_before_a_row_is_written(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Release');

        $this->journal->assertRefused(FixtureRefused::class, fn () => $plans->plan('Release'));

        $this->journal->assertRefused(FixtureRefused::class, fn () => $plans->withPlan('Missing', fn (
            TestPlan $plan,
        ) => $plan
            ->addPhase('Build')));

        $this->assertSame(1, Plan::query()->count());
        $this->assertSame(0, Phase::query()->count());
    }

    public function test_a_plan_in_a_state_and_a_started_plan_stand_in_their_state(): void
    {
        $plans = $this->journal->owner()->fixtures(PlanFixtures::class)
            ->planIn('Done', PlanStatus::Done)
            ->startedPlan('Running');

        $plans->assertStatus('Done', PlanStatus::Done)->assertStatus('Running', PlanStatus::Started);
        $this->assertSame($this->journal->ownerUser()->id, $plans->planCalled('Done')->creator_id);
    }

    public function test_tasks_placed_in_a_phase_stand_in_the_order_given(): void
    {
        $this->journal->owner();

        $first = Task::create(
            'Design',
            'The first step.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();

        $second = Task::create(
            'Build',
            'The second step.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();

        $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release')
            ->withPlan('Release', fn (TestPlan $plan) => $plan->addPhase('Work'))
            ->withPhase('Work', fn (TestPhase $phase) => $phase
                ->place($first, $second)->assertTask($first, 1)->assertTask($second, 2));
    }
}
