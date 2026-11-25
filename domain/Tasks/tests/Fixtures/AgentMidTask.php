<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use Domain\Tasks\TasksDomain;
use Tests\Support\Seeding\ScenarioRequirements;
use Tests\Support\Seeding\StartScenario;
use Tests\Support\Seeding\TestJournal;

/**
 * A new journal whose owner made a task and whose one agent started it and works on it now.
 *
 * @implements StartScenario<RunningTask>
 */
final readonly class AgentMidTask implements StartScenario
{
    public function __construct(
        private string $owner = 'Jo',
        private string $worker = 'Writer',
        private string $task = 'Draft',
    ) {}

    public function requirements(): ScenarioRequirements
    {
        return new ScenarioRequirements(domains: [TasksDomain::class], makesOwner: true);
    }

    public function freshNames(): array
    {
        return [$this->owner, $this->worker, $this->task];
    }

    public function start(TestJournal $journal): RunningTask
    {
        $journal->owner($this->owner)->agent($this->worker);

        return $journal->startScenario(new StartNamedTask($this->owner, $this->worker, $this->task));
    }
}
