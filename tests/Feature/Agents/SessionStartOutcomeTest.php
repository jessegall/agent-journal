<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Commands\Sessions\DismissSessionStartOutcome\DismissSessionStartOutcomeCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Sessions\StartDisposition;
use App\Enums\Sessions\StartOriginType;
use App\Enums\Sessions\StartRefusalType;
use App\Exceptions\CapacityUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\RecordIdentity;
use App\Support\SessionStartOutcome;
use App\Support\StartReceipt;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\HostCapacity;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\CountingImageVerifier;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An agent's latest start outcome comes from its start records, a sessionless refusal included; a viewer's dismissal
 * hides that version from that viewer alone after a reload, and a later start's outcome takes its place.
 */
final class SessionStartOutcomeTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;
    use WithActiveAccount;

    private const string IMAGE = 'registry.example/journal-helper@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    private string $ownerId;

    private string $agentId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->ownerId = User::factory()->create()->id;
        $this->startUserRequestAs($this->ownerId);
        $this->agentId = Agent::create('Builder', 'writing-helper', $this->localProject())->id;
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());
    }

    public function test_a_sessionless_capacity_refusal_is_the_agents_last_start_outcome(): void
    {
        $request = $this->refusedStart();

        $outcome = $this->outcome();

        $this->assertSame(
            [$request->requestId, StartDisposition::Refused, null, StartRefusalType::CapacityUnavailable->value],
            [$outcome?->requestId, $outcome?->disposition, $outcome?->sessionId, $outcome?->refusalReason],
        );
    }

    public function test_a_dismissal_survives_a_reload_for_that_viewer_only(): void
    {
        $request = $this->refusedStart();

        $this->dismiss($request);

        $this->assertNull($this->outcome());
        $this->assertNull($this->outcome());
        $this->startRequestAs($this->agentId, TestSelections::requestId());
        $this->assertSame($request->requestId, $this->outcome()?->requestId);
    }

    public function test_a_later_successful_start_replaces_the_refusal(): void
    {
        $refused = $this->refusedStart();
        $this->dismiss($refused);
        $this->app->instance(HostCapacity::class, new HostCapacity(64, 256 * 1024 ** 3, 1024 ** 4));

        $receipt = $this->start($this->containerRequest());

        $outcome = $this->outcome();
        $this->assertSame(
            [StartDisposition::Started, $receipt->sessionId, null],
            [$outcome?->disposition, $outcome?->sessionId, $outcome?->refusalReason],
        );
    }

    private function refusedStart(): StartRequest
    {
        $this->app->instance(HostCapacity::class, new HostCapacity(0, 0, 0));
        $request = $this->containerRequest();
        $this->assertThrows(fn () => $this->start($request), CapacityUnavailable::class);

        return $request;
    }

    private function dismiss(StartRequest $request): void
    {
        $this->commands()->run(
            new DismissSessionStartOutcomeCommand($this->agentId, $request->requestId, StartDisposition::Refused),
        );
    }

    private function outcome(): SessionStartOutcome|null
    {
        return $this->app->make(AgentDirectory::class)->visibleAgent($this->agentId)->startOutcome;
    }

    private function containerRequest(): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $this->agentId,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(new ExecutionPolicy(
                ExecutionModeType::RequiredContainer,
                self::IMAGE,
                'helper-7',
                ExecutionBudgets::defaults(),
                [],
            )),
            driverType: DriverType::Headless,
        );
    }

    private function start(StartRequest $request): StartReceipt
    {
        return $this->commands()->run(new StartAgentCommand($request));
    }

    private function commands(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
