<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\CreateAgent;
use App\Agents\Contracts\AgentResolver;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Core creates helper agents through CreateAgent, and refuses a blank name.
 */
final class AgentCreationTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->startUserRequestAs($this->owner->id);
    }

    public function test_a_read_only_and_a_writing_helper_are_created_and_read_through_the_agent_reader(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $resolver = $bus->run(new CreateAgent('Researcher', 'read-only-helper'));
        $writer = $bus->run(new CreateAgent('Builder', 'writing-helper'));
        $labels = $this->app->make(AgentResolver::class)->labelsFor([$resolver, $writer]);

        $this->assertSame(['Researcher', 'Builder'], [$labels[$resolver]->name, $labels[$writer]->name]);
        $this->assertSame(
            ['read-only-helper', 'writing-helper'],
            [Agent::query()->findOrFail($resolver)->profile_key, Agent::query()->findOrFail($writer)->profile_key],
        );
    }

    public function test_a_blank_name_is_refused_naming_it_and_no_agent_exists(): void
    {
        $agents = Agent::query()->count();

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new CreateAgent('   ', 'writing-helper')),
            CommandInputInvalid::class,
            'name: The name field is required.',
        );
        $this->assertSame($agents, Agent::query()->count());
    }
}
