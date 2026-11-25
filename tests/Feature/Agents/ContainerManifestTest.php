<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Projects\HostCapabilityType;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\CapacityUnavailable;
use App\Exceptions\ContainerUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\CapacityReservation;
use App\Support\Access\AccessSettings;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\RecordIdentity;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\HostCapacity;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A writing helper's container gets exactly the listed controls; anything more is refused by name, and a required
 * container start is admitted only on a proven host, with a verified image and room left, before anything is kept.
 */
final class ContainerManifestTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    private const string IMAGE = 'registry.example/journal-helper@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
    }

    public function test_a_host_without_a_proven_container_runtime_refuses_before_reserving(): void
    {
        $this->signIn();
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                $status = $query->capability === HostCapabilityType::AccountTransport
                    ? CapabilityStatusType::Supported
                    : CapabilityStatusType::Unverified;

                return new HostCapability($query, $status, 'docs/x.md', 'Runtime unavailable.');
            }
        });

        $this->assertThrows(fn () => $this->start($this->containerRequest()), ContainerUnavailable::class);

        $this->assertSame(0, CapacityReservation::query()->count());
    }

    public function test_capacity_beyond_the_host_refuses(): void
    {
        $this->signIn();
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
        $this->app->instance(DockerImageVerifier::class, new class implements DockerImageVerifier
        {
            public function isVerified(string $imageReference): bool
            {
                return true;
            }
        });
        $this->app->instance(HostCapacity::class, new HostCapacity(3, 16 * 1024 ** 3, 50 * 1024 ** 3));

        $this->start($this->containerRequest());

        $this->assertThrows(fn () => $this->start($this->containerRequest()), CapacityUnavailable::class);
        $this->assertSame(1, CapacityReservation::query()->count());
        $this->assertSame(1, AgentSession::query()->count());
    }

    private function policy(): ExecutionPolicy
    {
        return new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            self::IMAGE,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );
    }

    private function signIn(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->journal->actAsUserId($owner->id);
    }

    private function containerRequest(): StartRequest
    {
        $agent = Agent::create('Builder', 'writing-helper', $this->localProject());

        return new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($this->policy()),
            driverType: DriverType::Headless,
        );
    }

    private function start(StartRequest $request): mixed
    {
        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
    }
}
