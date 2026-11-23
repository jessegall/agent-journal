<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Time\ServerClock;
use App\Data\ScreenFrameData;
use App\Data\TerminalFrameData;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalView;
use App\Support\EnrolledHost;
use App\Support\HeldFrame;
use App\Support\RuntimeScreen;
use App\Support\ScreenRegistration;
use App\Support\TerminalViews;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
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
 * frames a second, and only for the runtime's current screen identity; every refusal answers refused and keeps
 * nothing, and a refused delayed frame reaches neither a watcher nor a view opened after it.
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

        $latest = $this->app->make(RuntimeScreen::class)->latest(ScreenRegistration::of($runtime));
        $this->assertSame(1, $latest?->frame->sequence);
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
        $latest = $this->app->make(RuntimeScreen::class)->latest(ScreenRegistration::of($runtime));
        $this->assertSame(4, $latest?->frame->sequence);
    }

    public function test_a_delayed_report_from_before_the_host_restarted_is_refused_for_every_view(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->watchedRuntimeOn($host);
        $this->report($host, $runtime, 7, frame: ['epoch' => 'epoch-1', 'stream' => 'stream-1']);
        $this->report($host, $runtime, 1, 'after restart', ['epoch' => 'epoch-2', 'stream' => 'stream-1']);

        $delayed = $this->report($host, $runtime, 8, 'before restart', ['epoch' => 'epoch-1', 'stream' => 'stream-1']);

        $delayed->assertExactJson(['status' => 'refused', 'reason' => 'retired']);
        $this->assertSame(['after restart', 'after restart'], $this->textsSeenBy($runtime));
    }

    public function test_a_delayed_public_report_from_before_a_shield_is_refused_and_a_newer_one_shows(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->watchedRuntimeOn($host);
        $this->report($host, $runtime, 2, 'secret', ['shielded' => true, 'rows' => [], 'privacy_revision' => 1]);

        $delayed = $this->report($host, $runtime, 1, 'before shield', ['privacy_revision' => 0]);

        $delayed->assertExactJson(['status' => 'refused', 'reason' => 'retired']);
        $this->assertSame([null, null], $this->textsSeenBy($runtime));

        $newer = $this->report($host, $runtime, 3, 'public again', ['privacy_revision' => 1]);

        $newer->assertExactJson(['status' => 'stored']);
        $this->assertSame(['public again', 'public again'], $this->textsSeenBy($runtime));
    }

    /**
     * The first row's text the runtime's existing watcher sees, then what a view opened only now sees; null for a
     * frame with no rows.
     *
     * @return list<string|null>
     */
    private function textsSeenBy(AgentRuntime $runtime): array
    {
        $views = $this->app->make(TerminalViews::class);
        $agentId = $runtime->session->agent_id;
        $now = CarbonImmutable::now();
        $watcher = TerminalView::query()->ownedBy(TestActors::userIdentity(1))->live()->value('read_interest_id');
        $openedId = $views->open($agentId, TestActors::userIdentity(2), 500, (string) Str::ulid(), $now);
        $opened = $views->answerFor(TestActors::userIdentity(2), $openedId, $now)->readInterestId;

        return [
            $this->firstRowText($views->frame($agentId, TestActors::userIdentity(1), new HeldFrame($watcher, '', '', 0), $now)),
            $this->firstRowText($views->frame($agentId, TestActors::userIdentity(2), new HeldFrame($opened, '', '', 0), $now)),
        ];
    }

    private function firstRowText(TerminalFrameData $answer): string|null
    {
        $frame = $answer->frame;

        if (! $frame instanceof ScreenFrameData || $frame->rows === []) {
            return null;
        }

        return $frame->rows[0]->runs[0]->text;
    }

    private function watchedRuntimeOn(EnrolledHost $host): AgentRuntime
    {
        $runtime = $this->runtimeOn($host->hostId);
        TerminalView::create(TestActors::userIdentity(1), $runtime, 500, CarbonImmutable::now(), (string) Str::ulid());

        return $runtime;
    }

    /**
     * @param  array<string, mixed>  $frame  the frame fields that differ from an ordinary public frame
     */
    private function report(
        EnrolledHost $host,
        AgentRuntime $runtime,
        int $sequence,
        string $text = 'hello',
        array $frame = [],
    ): TestResponse {
        return $this->hostCall($host, '/host/reports/screen', [
            'runtime_id' => $runtime->id,
            'frame' => [...[
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
            ], ...$frame],
        ]);
    }

    private function assertRefused(TestResponse $response, string $reason, AgentRuntime $runtime): void
    {
        $response->assertOk()->assertExactJson(['status' => 'refused', 'reason' => $reason]);
        $this->assertNull($this->app->make(RuntimeScreen::class)->latest(ScreenRegistration::of($runtime)));
    }
}
