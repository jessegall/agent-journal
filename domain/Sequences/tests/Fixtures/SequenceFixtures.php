<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Fixtures;

use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Models\SequenceRun;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;

/**
 * Sequence runs kept under the names a test gives them: a run of steps no one follows yet, started for a named
 * agent's session through the Sequences command.
 */
final class SequenceFixtures
{
    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('SequenceFixtures');
    }

    /**
     * A run of the steps no one follows yet, titled after its name unless a title is given.
     *
     * @param  list<string>  $steps
     */
    public function run(string $name, array $steps, string|null $title = null): self
    {
        $this->aliases->claim($name);
        $this->aliases->remember($name, SequenceRun::create($title ?? $name, $steps));

        return $this;
    }

    /**
     * The run the naming verb makes, given back at once instead of read back by its name.
     *
     * @param  list<string>  $steps
     */
    public function createRun(string $name, array $steps, string|null $title = null): SequenceRun
    {
        return $this->run($name, $steps, $title)->runCalled($name);
    }

    /**
     * The named agent's session starts following the run.
     */
    public function startRun(string $name, string $agent): self
    {
        $command = new StartSequenceCommand($this->runCalled($name)->id, $this->journal->sessionOf($agent)->id);
        $this->journal->runAs($agent, $command);

        return $this;
    }

    public function runCalled(string $name): SequenceRun
    {
        return $this->aliases->model(SequenceRun::class, $name);
    }

    /**
     * The run is running at this step and followed by the named agent.
     */
    public function assertStep(string $name, int $step, string $follower): self
    {
        $run = $this->runCalled($name);
        $agent = $this->journal->actorCalled($follower);

        Assert::assertSame(
            [SequenceRunStatus::Running, $step, $agent->type, $agent->id],
            [$run->status, $run->current_step, $run->actor_type, $run->actor_id],
            "The run {$name} stands otherwise.",
        );

        return $this;
    }

    public function assertFinished(string $name): self
    {
        Assert::assertSame(SequenceRunStatus::Finished, $this->runCalled($name)->status, "{$name} has not finished.");

        return $this;
    }

    /**
     * No one follows the run, and it is still at the step and in the state it had.
     */
    public function assertUnassigned(string $name, int $priorStep, SequenceRunStatus $priorStatus): self
    {
        $run = $this->runCalled($name);

        Assert::assertSame(
            [null, null, $priorStep, $priorStatus],
            [$run->actor_type, $run->actor_id, $run->current_step, $run->status],
            "The run {$name} was taken or moved.",
        );

        return $this;
    }
}
