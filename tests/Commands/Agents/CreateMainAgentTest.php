<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\CreateMainAgent\CreateMainAgentCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStartChoice;
use App\Values\ProfileBase;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsCommand(CreateMainAgentCommand::class)]
final class CreateMainAgentTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_owner_creates_a_main_agent_with_its_first_start_choice(): void
    {
        $this->journal->owner();
        $command = new CreateMainAgentCommand($this->localProject()->id, DefaultDrivers::CODEX, 'gpt-5.5', null);

        $actor = $this->journal->runAs('Owner', $command);

        $agent = Agent::query()->findOrFail($actor->id);
        $choice = AgentStartChoice::findFor($agent->id);
        $this->assertNotNull($choice);
        $this->assertSame(ProfileBase::mainAgent()->key, $agent->profile_key);
        $this->assertSame([DefaultDrivers::CODEX, 'gpt-5.5', null], [
            $choice->driver,
            $choice->model,
            $choice->chosenAccount(),
        ]);
    }
}
