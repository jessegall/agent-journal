<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Contracts\ActiveAccountReader;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\StartExecutor;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Models\Agent;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Values\ExecutionBudgets;
use App\Agents\Values\ExecutionPolicy;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Support\DefaultDrivers;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class HostBridgeTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_unproven_account_transport_refuses_before_account_selection_or_host_preparation(): void
    {
        $this->startTestUserRequest(1);
        $this->mock(ActiveAccountReader::class)->shouldNotReceive('forStart');
        $this->mock(StartExecutor::class)->shouldNotReceive('start');
        $this->mock(HostCapabilities::class)->shouldReceive('capability')->andReturnUsing(
            fn (HostCapabilityQuery $query) => new HostCapability(
                $query,
                $query->capability === HostCapabilityType::AccountTransport
                    ? CapabilityStatusType::Unverified : CapabilityStatusType::Supported,
                'Test evidence',
                'Recorded for the test.',
            ),
        );
        $commands = $this->app->make(CommandBus::class);
        $actor = Agent::create('Builder', 'writing-helper');

        foreach (DefaultDrivers::familyKeys() as $driver) {
            $this->assertThrows(
                fn () => $commands->run(new StartAgentCommand($this->requestFor($actor, $driver))),
                AccountContainerUnsupported::class,
            );
        }
    }

    private function requestFor(Agent $actor, string $driver): StartRequest
    {
        $image = 'registry.example/journal-helper@sha256:'.str_repeat('a', 64);
        $policy = ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            $image,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );

        return new StartRequest(
            TestSelections::requestId(),
            $actor->id,
            TestSelections::of($driver),
            StartOriginType::OwnerRequest,
            'helpers.job 1',
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($policy),
        );
    }
}
