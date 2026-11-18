<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\CreateAgent;
use App\Agents\Contracts\AgentReader;
use App\Agents\Enums\AgentRole;
use App\Agents\Exceptions\AgentNameRequired;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Core creates helper agents through CreateAgent, and refuses a blank name.
 */
final class AgentCreationTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
    }

    public function test_a_read_only_and_a_writing_helper_are_created_and_read_through_the_agent_reader(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $reader = $bus->run(new CreateAgent('Researcher', AgentRole::ReadOnlyHelper));
        $writer = $bus->run(new CreateAgent('Builder', AgentRole::WritingHelper));
        $labels = $this->app->make(AgentReader::class)->labelsFor([$reader, $writer]);

        $this->assertSame(['Researcher', 'Builder'], [$labels[$reader]->name, $labels[$writer]->name]);
        $this->assertSame([AgentRole::ReadOnlyHelper->value, AgentRole::WritingHelper->value], [Agent::query()->findOrFail($reader)->role, Agent::query()->findOrFail($writer)->role]);
    }

    public function test_a_blank_name_is_refused(): void
    {
        $this->expectException(AgentNameRequired::class);

        $this->app->make(CommandBus::class)->run(new CreateAgent('   ', AgentRole::WritingHelper));
    }
}
