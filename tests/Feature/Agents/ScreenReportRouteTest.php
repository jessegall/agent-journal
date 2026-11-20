<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\ServerClock;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\TerminalView;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\RuntimeScreen;
use Carbon\CarbonImmutable;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\FakeServerClock;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host's screen frame is kept only for a runtime it runs and somebody watches, within the size bound and four
 * frames a second; every refusal answers refused and keeps nothing.
 */
#[TimeLimit(seconds: 3, reason: 'It commits real rows on the hook database and empties its tables around each test.')]
final class ScreenReportRouteTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'terminal_views',
    ];

    public function test_a_frame_of_a_watched_runtime_of_the_host_is_stored(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->watchedRuntimeOn($host);

        $this->report($host, $runtime, 1)->assertOk()->assertExactJson(['status' => 'stored']);

        $this->assertSame(1, $this->app->make(RuntimeScreen::class)->latest($runtime->id)?->frame->sequence);
    }

    public function test_a_runtime_another_host_runs_is_refused(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->watchedRuntimeOn($this->enrolledHost());

        $this->assertRefused($this->report($host, $runtime, 1), 'not_your_runtime', $runtime);
    }

    public function test_a_runtime_nobody_watches_is_refused(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->runtimeOn($host->hostId);

        $this->assertRefused($this->report($host, $runtime, 1), 'not_watched', $runtime);
    }

    public function test_a_frame_over_the_size_bound_is_refused(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->watchedRuntimeOn($host);

        $this->assertRefused($this->report($host, $runtime, 1, str_repeat('x', 256 * 1024)), 'too_large', $runtime);
    }

    public function test_frames_past_four_a_second_are_refused(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->watchedRuntimeOn($host);
        $this->app->instance(ServerClock::class, new FakeServerClock(CarbonImmutable::parse('2026-11-19 12:00:00')));

        foreach (range(1, 4) as $sequence) {
            $this->report($host, $runtime, $sequence)->assertExactJson(['status' => 'stored']);
        }

        $this->report($host, $runtime, 5)->assertExactJson(['status' => 'refused', 'reason' => 'too_fast']);
        $this->report($host, $runtime, 6)->assertExactJson(['status' => 'refused', 'reason' => 'too_fast']);
        $this->assertSame(4, $this->app->make(RuntimeScreen::class)->latest($runtime->id)?->frame->sequence);
    }

    private function watchedRuntimeOn(EnrolledHost $host): AgentRuntime
    {
        $runtime = $this->runtimeOn($host->hostId);
        TerminalView::open(TestActors::userIdentity(1), $runtime, 500, CarbonImmutable::now());

        return $runtime;
    }

    private function report(
        EnrolledHost $host,
        AgentRuntime $runtime,
        int $sequence,
        string $text = 'hello',
    ): TestResponse {
        return $this->hostCall($host, '/host/reports/screen', [
            'runtime_id' => $runtime->id,
            'frame' => [
                'epoch' => 'epoch-1',
                'sequence' => $sequence,
                'captured' => '2026-11-19T12:00:00Z',
                'columns' => 20,
                'rows' => [[['text' => $text, 'style' => (object) []]]],
                'cursor' => ['row' => 0, 'column' => 5, 'visible' => true],
                'buffer' => 'normal',
                'plain' => false,
                'too_large' => false,
                'unreadable' => false,
                'no_terminal' => false,
            ],
        ]);
    }

    private function assertRefused(TestResponse $response, string $reason, AgentRuntime $runtime): void
    {
        $response->assertOk()->assertExactJson(['status' => 'refused', 'reason' => $reason]);
        $this->assertNull($this->app->make(RuntimeScreen::class)->latest($runtime->id));
    }
}
