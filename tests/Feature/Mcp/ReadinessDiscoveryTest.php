<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Agents\Contracts\LaunchReadiness;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\TestCase;

/**
 * An authenticated tools/list records the launch's tool discovery at the call's signed issue time; nothing else does.
 */
final class ReadinessDiscoveryTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials'];

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->launch = TestLaunch::start();
    }

    public function test_a_tools_list_sets_discovered_at_to_the_signed_issue_time(): void
    {
        $signedAt = CarbonImmutable::now()->subSeconds(5)->startOfSecond();

        $this->sendMcp($this->launch, 'tools/list', issuedAt: $signedAt->getTimestamp())->assertOk();

        $this->assertTrue($signedAt->equalTo($this->launch->session->fresh()?->discovered_at));
    }

    public function test_an_initialize_alone_records_nothing(): void
    {
        $this->sendMcp($this->launch, 'initialize', ['protocolVersion' => '2025-11-25', 'capabilities' => (object) [], 'clientInfo' => ['name' => 'test', 'version' => '1']])->assertOk();
        $this->sendMcp($this->launch, 'ping')->assertOk();

        $this->assertNull($this->launch->session->fresh()?->discovered_at);
    }

    public function test_an_older_discovery_never_moves_it_back(): void
    {
        $readiness = $this->app->make(LaunchReadiness::class);
        $later = CarbonImmutable::now()->startOfSecond();

        $readiness->recordDiscovery($this->launch->session->id, $later);
        $readiness->recordDiscovery($this->launch->session->id, $later->subMinute());

        $this->assertTrue($later->equalTo($this->launch->session->fresh()?->discovered_at));
    }

    public function test_discovered_since_compares_the_discovery_with_the_launch_generation(): void
    {
        $readiness = $this->app->make(LaunchReadiness::class);
        $discoveredAt = CarbonImmutable::now()->startOfSecond();

        $this->assertFalse($readiness->discoveredSince($this->launch->session->id, $discoveredAt->subMinute()));

        $readiness->recordDiscovery($this->launch->session->id, $discoveredAt);

        $this->assertTrue($readiness->discoveredSince($this->launch->session->id, $discoveredAt->subMinute()));
        $this->assertFalse($readiness->discoveredSince($this->launch->session->id, $discoveredAt->addMinute()));
    }
}
