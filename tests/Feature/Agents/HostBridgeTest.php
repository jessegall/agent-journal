<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\StartExecutor;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Projects\HostCapabilityType;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\AccountContainerUnsupported;
use App\Models\Agents\Agent;
use App\Support\DefaultDrivers;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\RecordIdentity;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\StartPolicy;
use App\Values\StartRequest;
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
        $actor = Agent::create('Builder', 'writing-helper', $this->localProject());

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
        $policy = new ExecutionPolicy(
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
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($policy),
            driverType: DriverType::Headless,
        );
    }
}
