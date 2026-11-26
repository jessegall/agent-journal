<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Fixtures;

use App\Support\ActorReference;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\AddPhase\AddPhaseCommand;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
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

    public function phase(string $plan, string $name, string|null $title = null): self
    {
        $planId = (string) $this->aliases->read(Plan::class, $plan);
        $this->aliases->claim($name);

        $this->aliases->rememberResult(
            $name,
            $this->journal->asOwner(new AddPhaseCommand($planId, $title ?? $name)),
            Phase::class,
        );

        return $this;
    }

    /**
     * A new phase of the plan with the task placed in it, as the Plans command places one.
     */
    public function phaseWithTask(string $plan, string $name, RecordIdentity $task): self
    {
        self::assertTasks([$task]);

        return $this->phase($plan, $name)->placeTasks($name, $task);
    }

    /**
     * The tasks placed at the end of the phase, in this order, as the Plans command places them.
     */
    public function placeTasks(string $phase, RecordIdentity ...$tasks): self
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
     * The phase of this name belongs to the plan and has this number in it.
     */
    public function assertPhase(string $name, string $plan, int $number): self
    {
        $phase = $this->phaseCalled($name);

        Assert::assertSame([$this->planCalled($plan)->id, $number], [$phase->plan_id, $phase->number]);

        return $this;
    }

    /**
     * The task stands at this place among the phase's tasks, counted from 1.
     */
    public function assertPhaseTask(string $phase, RecordIdentity $task, int $position): self
    {
        $placed = PhaseTask::query()->ofPhase(
            $this->phaseCalled($phase)->id,
        )->inPositionOrder()->pluck('task_id')->all();

        Assert::assertSame($task->id, $placed[$position - 1] ?? null, "The phase {$phase} holds another task there.");

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
