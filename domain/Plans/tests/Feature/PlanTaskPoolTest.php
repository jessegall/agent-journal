<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Enums\PoolInputType;
use App\Assignments\Exceptions\AssignmentPoolTooLarge;
use App\Assignments\Exceptions\AssignmentPoolUnavailable;
use App\Assignments\Support\PoolDefinition;
use App\Assignments\Support\PoolMembers;
use App\Assignments\Support\PoolReference;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Assignments\PlanTaskPoolFactory;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\PlanPoolRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * Plans declares the pool plans.tasks: a started plan's tasks phase by phase and in each phase's order, read afresh
 * each time it opens; a plan that is not started or holds more than 1,000 tasks gives none.
 */
final class PlanTaskPoolTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private ActorIdentity $builder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->builder = new ActorIdentity(ActorType::Agent, TestIds::of(7));
        $this->startUserRequestAs(TestIds::of(1));
    }

    public function test_plans_declares_the_pool_of_a_plans_tasks_at_boot(): void
    {
        $providers = $this->app->make(AssignmentProviders::class);

        $this->assertContains(
            'plans.tasks',
            array_map(fn (PoolDefinition $pool) => $pool->key, $providers->pools(TaskType::VALUE)),
        );
        $this->assertSame('Plans', $providers->poolOwner('plans.tasks'));
        $this->assertInstanceOf(PlanTaskPoolFactory::class, $providers->poolFactory('plans.tasks'));
    }

    public function test_a_started_plan_opens_to_its_tasks_phase_by_phase(): void
    {
        $plan = Plan::factory()->create(['state' => PlanState::Started]);
        $build = $plan->addPhase('Build');
        $review = $plan->addPhase('Review');
        [$first, $second, $third, $fourth] = array_map(fn () => Task::factory()->create()->id, range(1, 4));
        $review->addTask($fourth);
        $build->addTask($second);
        $review->addTask($third);
        $build->addTask($first);
        $factory = $this->app->make(PlanTaskPoolFactory::class);

        $this->assertSame([$second, $first, $fourth, $third], $this->open($factory, $plan)->ids->ids);

        $later = Task::factory()->create()->id;
        $build->addTask($later);

        $this->assertSame([$second, $first, $later, $fourth, $third], $this->open($factory, $plan)->ids->ids);
    }

    public function test_a_plan_that_is_not_started_gives_no_tasks(): void
    {
        $factory = $this->app->make(PlanTaskPoolFactory::class);

        foreach ([PlanState::Planned, PlanState::Paused, PlanState::Done] as $state) {
            $plan = Plan::factory()->create(['state' => $state]);
            $plan->addPhase('Build')->addTask(Task::factory()->create()->id);
            $factory->validate(self::reference($plan), $this->builder);

            $this->assertThrows(
                fn () => $this->open($factory, $plan),
                AssignmentPoolUnavailable::class,
                "is {$state->value}",
            );
        }
    }

    public function test_a_plan_of_more_than_a_thousand_tasks_gives_none(): void
    {
        $plan = Plan::factory()->create(['state' => PlanState::Started]);
        $plan->addPhase('Build')->addTasks(array_map(fn () => (string) Str::ulid(), range(1, 1001)));

        $this->expectException(AssignmentPoolTooLarge::class);
        $this->expectExceptionMessage('more than 1000 records');

        $this->open($this->app->make(PlanTaskPoolFactory::class), $plan);
    }

    public function test_a_reference_that_does_not_name_one_existing_plan_is_refused(): void
    {
        $factory = $this->app->make(PlanTaskPoolFactory::class);
        $plan = Plan::factory()->create();
        $task = Task::factory()->create()->id;

        $this->assertThrows(
            fn () => $factory->validate(new PoolReference('plans.tasks', null, []), $this->builder),
            PlanPoolRefused::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(
                new PoolReference('plans.tasks', new RecordIdentity(TaskType::VALUE, $task), []),
                $this->builder,
            ),
            PlanPoolRefused::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(
                new PoolReference('plans.tasks', $plan->assignmentIdentity(), [$task]),
                $this->builder,
            ),
            PlanPoolRefused::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(
                new PoolReference('plans.tasks', new RecordIdentity(Plan::LINK_TYPE, TestIds::of(99)), []),
                $this->builder,
            ),
            PlanMissing::class,
        );
    }

    public function test_the_description_names_the_plan_once_it_is_found(): void
    {
        $plan = Plan::factory()->create(['title' => 'Ship the pools']);

        $factory = $this->app->make(PlanTaskPoolFactory::class);

        $description = $factory->describe(self::reference($plan), $this->builder);

        $this->assertSame('Tasks in a started plan', $description->label);
        $this->assertStringContainsString('Ship the pools', $description->help);
        $this->assertSame(PoolInputType::Target, $description->input);
    }

    private function open(PlanTaskPoolFactory $factory, Plan $plan): PoolMembers
    {
        return $factory->open(self::reference($plan), $this->builder)->members();
    }

    private static function reference(Plan $plan): PoolReference
    {
        return new PoolReference('plans.tasks', $plan->assignmentIdentity(), []);
    }
}
