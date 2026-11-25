<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Contracts\Assignments\AssignmentProviders;
use App\Enums\Assignments\PoolInputType;
use App\Exceptions\AssignmentPoolTooLarge;
use App\Exceptions\AssignmentPoolUnavailable;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\OrderedRecordIds;
use App\Support\PoolDefinition;
use App\Support\PoolMembers;
use App\Support\PoolReference;
use App\Support\RecordIdentity;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Exceptions\PlanPoolRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\Assignments\PlanTaskPoolFactory;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskType;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;

/**
 * Plans declares the pool plans.tasks: a started plan's tasks phase by phase and in each phase's order, read afresh
 * each time it opens; a plan that is not started or holds more than 1,000 tasks gives none.
 */
final class PlanTaskPoolTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $builder;

    private const string PLAN_TITLE = 'Ship the pools';

    private const string POOL_LABEL = 'Tasks in a started plan';

    protected function setUp(): void
    {
        parent::setUp();

        $this->builder = ActorIdentity::ofClass(Agent::class, TestIds::of(7));
        $this->journal->actAsUserId(TestIds::of(1));
    }

    public function test_plans_declares_the_pool_of_a_plans_tasks_at_boot(): void
    {
        $providers = $this->app->make(AssignmentProviders::class);

        $this->assertContains(
            'plans.tasks',
            array_map(fn (PoolDefinition $pool) => $pool->key, $providers->pools(TaskType::linkType())),
        );

        $this->assertSame('Plans', $providers->poolOwner('plans.tasks'));
        $this->assertInstanceOf(PlanTaskPoolFactory::class, $providers->poolFactory('plans.tasks'));
    }

    public function test_a_started_plan_opens_to_its_tasks_phase_by_phase(): void
    {
        $plan = Plan::factory()->create(['status' => PlanStatus::Started]);
        $build = $this->planStructure()->addPhase($plan, 'Build');
        $review = $this->planStructure()->addPhase($plan, 'Review');
        [$first, $second, $third, $fourth] = array_map(fn () => Task::factory()->create()->id, range(1, 4));
        $this->planStructure()->addTasks($review, [$fourth]);
        $this->planStructure()->addTasks($build, [$second]);
        $this->planStructure()->addTasks($review, [$third]);
        $this->planStructure()->addTasks($build, [$first]);
        $factory = $this->app->make(PlanTaskPoolFactory::class);

        $this->assertSame([
            $second,
            $first,
            $fourth,
            $third,
        ], $this->open($factory, $plan)->ids->ids);

        $later = Task::factory()->create()->id;
        $this->planStructure()->addTasks($build, [$later]);

        $this->assertSame([
            $second,
            $first,
            $later,
            $fourth,
            $third,
        ], $this->open($factory, $plan)->ids->ids);
    }

    /**
     * @return array<string, array{PlanStatus}>
     */
    public static function unstartedStates(): array
    {
        return [
            'planned' => [PlanStatus::Planned],
            'paused' => [PlanStatus::Paused],
            'done' => [PlanStatus::Done],
        ];
    }

    #[DataProvider('unstartedStates')]
    public function test_a_plan_that_is_not_started_gives_no_tasks(PlanStatus $state): void
    {
        $factory = $this->app->make(PlanTaskPoolFactory::class);
        $plan = Plan::factory()->create(['status' => $state]);

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($plan, 'Build'),
            [Task::factory()->create()->id],
        );

        $factory->validate(self::reference($plan), $this->builder);

        $this->assertThrows(
            fn () => $this->open($factory, $plan),
            AssignmentPoolUnavailable::class,
            AssignmentPoolUnavailable::inState("Plan {$plan->number}", $state->value)->getMessage(),
        );
    }

    public function test_a_plan_of_more_than_a_thousand_tasks_gives_none(): void
    {
        $plan = Plan::factory()->create(['status' => PlanStatus::Started]);

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($plan, 'Build'),
            array_map(fn () => (string) Str::ulid(), range(1, 1001)),
        );

        $this->expectException(AssignmentPoolTooLarge::class);

        $this->expectExceptionMessage(
            AssignmentPoolTooLarge::holding("Plan {$plan->number}", OrderedRecordIds::LARGEST)->getMessage(),
        );

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
                new PoolReference('plans.tasks', new RecordIdentity(TaskType::linkType(), $task), []),
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
                new PoolReference('plans.tasks', new RecordIdentity(Plan::linkType(), TestIds::of(99)), []),
                $this->builder,
            ),
            PlanMissing::class,
        );
    }

    public function test_the_description_names_the_plan_once_it_is_found(): void
    {
        $plan = Plan::factory()->create(['title' => self::PLAN_TITLE]);

        $factory = $this->app->make(PlanTaskPoolFactory::class);

        $description = $factory->describe(self::reference($plan), $this->builder);

        $this->assertSame(self::POOL_LABEL, $description->label);
        $this->assertStringContainsString(self::PLAN_TITLE, $description->help);
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

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
