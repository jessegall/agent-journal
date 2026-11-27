<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Fixtures;

use App\Support\ActorReference;
use App\Support\RecordIdentity;
use Closure;
use Domain\Plans\Commands\AddPhase\AddPhaseCommand;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * Plans, their phases and the tasks placed in them, arranged by the owner through the Plans commands and kept under
 * the names a test gives them; a name is the test's own, never the title a plan shows.
 */
final class PlanFixtures
{
    private const string BRIEF = 'What the plan sets out to do.';

    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('PlanFixtures');
    }

    public function plan(
        string $name,
        string $brief = self::BRIEF,
        PlanType $type = PlanType::Build,
        string|null $title = null,
    ): self {
        $this->aliases->claim($name);
        $id = $this->journal->asOwner(new CreatePlanCommand($title ?? $name, $brief, $type, TestProjects::local()->id));
        $this->aliases->rememberResult($name, $id, Plan::class);

        return $this;
    }

    /**
     * The plan the naming verb makes, given back at once instead of read back by its name.
     */
    public function createPlan(
        string $name,
        string $brief = self::BRIEF,
        PlanType $type = PlanType::Build,
        string|null $title = null,
    ): Plan {
        return $this->plan($name, $brief, $type, $title)->planCalled($name);
    }

    /**
     * A plan its owner paused, which no command arranges on its own.
     */
    public function pausedPlan(
        string $name,
        string $brief = self::BRIEF,
        PlanType $type = PlanType::Build,
        string|null $title = null,
    ): self {
        return $this->planIn($name, PlanStatus::Paused, $brief, $type, $title);
    }

    /**
     * A plan already in this state, as a test that reads plans of every state needs one.
     */
    public function planIn(
        string $name,
        PlanStatus $status,
        string $brief = self::BRIEF,
        PlanType $type = PlanType::Build,
        string|null $title = null,
    ): self {
        $this->aliases->claim($name);
        $owner = $this->journal->ownerUser();

        $plan = Plan::factory()->create([
            'title' => $title ?? $name,
            'brief' => $brief,
            'type' => $type,
            'status' => $status,
            'creator_type' => $owner->actorType(),
            'creator_id' => $owner->actorId(),
        ]);

        $this->aliases->remember($name, $plan);

        return $this;
    }

    /**
     * A plan its owner made and started.
     */
    public function startedPlan(string $name, PlanType $type = PlanType::Build): self
    {
        $this->plan($name, type: $type)->planCalled($name)->startOnce(ActorReference::of($this->journal->ownerUser()));

        return $this;
    }

    /**
     * The plan the test named, handed to the scope to add and reach its phases.
     *
     * @param  Closure(TestPlan): mixed  $scope
     */
    public function withPlan(string $plan, Closure $scope): self
    {
        $this->planCalled($plan);
        $scope(new TestPlan($this, $plan));

        return $this;
    }

    /**
     * The phase the test named, handed to the scope to place and assert its tasks.
     *
     * @param  Closure(TestPhase): mixed  $scope
     */
    public function withPhase(string $phase, Closure $scope): self
    {
        $this->phaseCalled($phase);
        $scope(new TestPhase($this, $phase));

        return $this;
    }

    /**
     * A new phase of the named plan under its own name, titled as given or by its name, as the Plans command adds one.
     */
    public function addPhaseTo(string $plan, string $name, string|null $title = null): self
    {
        $planId = (string) $this->aliases->read(Plan::class, $plan);
        $this->aliases->claim($name);
        $added = $this->journal->asOwner(new AddPhaseCommand($planId, $title ?? $name));
        $this->aliases->rememberResult($name, $added, Phase::class);

        return $this;
    }

    /**
     * The tasks placed at the end of the named phase, in this order, as the Plans command places them.
     */
    public function placeIn(string $phase, RecordIdentity ...$tasks): self
    {
        self::assertTasks($tasks);
        $placed = $this->phaseCalled($phase);
        $ids = array_map(fn (RecordIdentity $task) => $task->id, $tasks);
        $this->journal->asOwner(new AddPhaseTasksCommand($placed->id, $placed->revision, $ids));

        return $this;
    }

    public function planCalled(string $name): Plan
    {
        return $this->aliases->model(Plan::class, $name);
    }

    public function phaseCalled(string $name): Phase
    {
        return $this->aliases->model(Phase::class, $name);
    }

    public function assertStatus(string $plan, PlanStatus $status): self
    {
        Assert::assertSame($status, $this->planCalled($plan)->status, "The plan {$plan} is in another state.");

        return $this;
    }

    /**
     * @param  list<RecordIdentity>  $records
     */
    private static function assertTasks(array $records): void
    {
        foreach ($records as $record) {
            if ($record->type !== Task::linkType()) {
                throw FixtureRefused::wrongRecord(Task::linkType(), $record->type);
            }
        }
    }
}
