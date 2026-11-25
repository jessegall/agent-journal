<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\TasksDomain;
use Tests\Support\Seeding\ScenarioRequirements;
use Tests\Support\Seeding\StartScenario;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner's new task of this name, started by an agent the journal already holds, who goes on acting.
 *
 * @implements StartScenario<RunningTask>
 */
final readonly class StartNamedTask implements StartScenario
{
    public function __construct(private string $owner, private string $worker, private string $task) {}

    public function requirements(): ScenarioRequirements
    {
        return new ScenarioRequirements(
            domains: [TasksDomain::class],
            names: [
                $this->owner,
                $this->worker,
            ],
            sessions: [$this->worker],
        );
    }

    public function freshNames(): array
    {
        return [$this->task];
    }

    public function start(TestJournal $journal): RunningTask
    {
        $tasks = $journal->fixtures(TaskFixtures::class)->task(
            $this->task,
            creator: $journal->userCalled($this->owner),
        );

        $task = $tasks->taskCalled($this->task);
        $number = $journal->actAs($this->worker)->run(new StartTaskCommand($task->id));

        return new RunningTask(
            $task->refresh(),
            $journal->sessionOf($this->worker),
            $tasks->runOf($this->task, $number),
        );
    }
}
