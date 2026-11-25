<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Reads\ReadMeter;
use App\Contracts\Sessions\AgentDirectory;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * The agent list reads what it needs once for all agents, so a journal with many agents lists them in one measured
 * read without repeating a read per agent.
 */
final class AgentListReadTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_a_dozen_agents_list_without_a_read_per_agent(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);

        foreach (range(1, 12) as $number) {
            Agent::create("Agent {$number}", 'main-agent', $this->localProject());
        }

        $listed = $this->app->make(ReadMeter::class)->measure(
            'the agent list',
            fn () => $this->app->make(AgentDirectory::class)->visible(),
        )->measuredAnswer;

        $this->assertGreaterThanOrEqual(12, count($listed));
    }
}
