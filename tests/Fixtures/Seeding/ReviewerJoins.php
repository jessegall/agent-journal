<?php

declare(strict_types=1);

namespace Tests\Fixtures\Seeding;

use App\Models\Agents\Agent;
use Tests\Support\Seeding\ScenarioRequirements;
use Tests\Support\Seeding\StartScenario;
use Tests\Support\Seeding\TestJournal;

/**
 * A test scenario: an agent of the given name joins the journal's owner and acts.
 *
 * @implements StartScenario<Agent>
 */
final readonly class ReviewerJoins implements StartScenario
{
    public function __construct(private string $name = 'Reviewer') {}

    public function requirements(): ScenarioRequirements
    {
        return new ScenarioRequirements(names: ['Owner']);
    }

    public function freshNames(): array
    {
        return [$this->name];
    }

    public function start(TestJournal $journal): Agent
    {
        return $journal->agent($this->name)->actAs($this->name)->agentCalled($this->name);
    }
}
