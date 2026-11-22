<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Actions\AgentRuntimes;
use App\Agents\Contracts\ToolDiscovery;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Models\AgentRuntime;
use App\Agents\Values\RuntimeIntent;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host withholds work until the driver discovered its tools in its current process generation (task 322): a
 * fresh runtime is not ready, a discovery after its start makes it ready, a discovery from before a new generation
 * does not carry over, and a session the host never started has nothing to wait for.
 */
#[TimeLimit(seconds: 4, reason: 'It starts a test agent session and opens its runtime.')]
final class ToolDiscoveryGenerationTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_discovery_after_the_generation_start_makes_the_session_ready_once_per_generation(): void
    {
        $start = TestStart::start('writing-helper');
        $this->app->make(AgentRuntimes::class)->open($start->session, $this->intent(), 'start-token');
        $discovery = $this->app->make(ToolDiscovery::class);

        $this->assertFalse($discovery->isDiscoveredInCurrentGeneration($start->session->id));

        $discovery->recordDiscovery($start->session->id, CarbonImmutable::now());
        $this->assertTrue($discovery->isDiscoveredInCurrentGeneration($start->session->id));

        $runtime = AgentRuntime::query()->where('agent_session_id', $start->session->id)->sole();
        $later = CarbonImmutable::now()->addSecond();
        $runtime->recordObservation(RuntimeActivity::Starting, HoldReason::None, 2, $later);

        $this->assertFalse($discovery->isDiscoveredInCurrentGeneration($start->session->id));
    }

    public function test_a_session_the_host_never_started_is_ready(): void
    {
        $start = TestStart::start();

        $discovery = $this->app->make(ToolDiscovery::class);

        $this->assertTrue($discovery->isDiscoveredInCurrentGeneration($start->session->id));
    }

    private function intent(): RuntimeIntent
    {
        return new RuntimeIntent(
            'host-1',
            base_path(),
            'claude-code',
            '1.0.0',
            'default',
            DriverVariant::Headless,
            null,
            null,
            null,
        );
    }
}
