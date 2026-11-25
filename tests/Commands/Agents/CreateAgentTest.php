<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\CreateAgent\CreateAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\AgentResolver;
use App\Exceptions\CommandInputInvalid;
use App\Models\Agents\Agent;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\TestCase;

/**
 * Core creates helper agents through CreateAgentCommand, and refuses a blank name.
 */
final class CreateAgentTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsOwnerRequest;

    private const string NAME_REQUIRED = 'name: The name field is required.';

    public function test_a_read_only_and_a_writing_helper_are_created_and_read_through_the_agent_reader(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $resolver = $bus->run(new CreateAgentCommand('Researcher', 'read-only-helper', $this->localProject()->id))->id;
        $writer = $bus->run(new CreateAgentCommand('Builder', 'writing-helper', $this->localProject()->id))->id;
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
            fn () => $this->app->make(CommandBus::class)->run(new CreateAgentCommand('   ', 'writing-helper', $this->localProject()->id)),
            CommandInputInvalid::class,
            self::NAME_REQUIRED,
        );
        $this->assertSame($agents, Agent::query()->count());
    }
}
