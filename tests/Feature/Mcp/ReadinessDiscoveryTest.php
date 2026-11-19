<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Agents\Contracts\StartReadiness;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\StartsTestAgent;
use Tests\TestCase;

/**
 * An authenticated tools/list records the start's tool discovery at the call's signed issue time; nothing else does.
 */
final class ReadinessDiscoveryTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use StartsTestAgent;

    private const array TABLES = ['agents', 'agent_sessions', 'start_tokens'];

    public function test_a_tools_list_sets_discovered_at_to_the_signed_issue_time(): void
    {
        $signedAt = CarbonImmutable::now()->subSeconds(5)->startOfSecond();

        $this->sendMcp($this->start, 'tools/list', issuedAt: $signedAt->getTimestamp())->assertOk();

        $this->assertTrue($signedAt->equalTo($this->start->session->fresh()?->discovered_at));
    }

    public function test_an_initialize_alone_records_nothing(): void
    {
        $this->sendMcp(
            $this->start,
            'initialize',
            [
                'protocolVersion' => '2025-11-25',
                'capabilities' => (object) [],
                'clientInfo' => ['name' => 'test', 'version' => '1'],
            ],
        )->assertOk();
        $this->sendMcp($this->start, 'ping')->assertOk();

        $this->assertNull($this->start->session->fresh()?->discovered_at);
    }

    public function test_an_older_discovery_never_moves_it_back(): void
    {
        $readiness = $this->app->make(StartReadiness::class);
        $later = CarbonImmutable::now()->startOfSecond();

        $readiness->recordDiscovery($this->start->session->id, $later);
        $readiness->recordDiscovery($this->start->session->id, $later->subMinute());

        $this->assertTrue($later->equalTo($this->start->session->fresh()?->discovered_at));
    }

    public function test_discovered_since_compares_the_discovery_with_the_start_generation(): void
    {
        $readiness = $this->app->make(StartReadiness::class);
        $discoveredAt = CarbonImmutable::now()->startOfSecond();

        $this->assertFalse($readiness->discoveredSince($this->start->session->id, $discoveredAt->subMinute()));

        $readiness->recordDiscovery($this->start->session->id, $discoveredAt);

        $this->assertTrue($readiness->discoveredSince($this->start->session->id, $discoveredAt->subMinute()));
        $this->assertFalse($readiness->discoveredSince($this->start->session->id, $discoveredAt->addMinute()));
    }
}
