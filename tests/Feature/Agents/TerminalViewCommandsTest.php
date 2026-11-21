<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\ServerClock;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Agents\Commands\CloseTerminalView;
use App\Agents\Commands\OpenTerminalView;
use App\Agents\Commands\RenewTerminalView;
use App\Agents\Enums\DriverType;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\TerminalView;
use App\Agents\Support\DriverRequestEndings;
use App\Agents\Support\WatchedRuntimes;
use App\Bus\Contracts\CommandBus;
use Carbon\CarbonImmutable;
use Tests\Support\FakeServerClock;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Opening, renewing and closing a terminal view: each refusal names what to do and stores nothing, a good open makes
 * one live view of the viewer and tells the host, and the host's watched list follows the live views.
 */
final class TerminalViewCommandsTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    public function test_a_good_open_makes_one_live_view_of_the_viewer_and_changes_the_hosts_version(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $watched = $this->app->make(WatchedRuntimes::class);
        $this->assertSame(0, $watched->version('host-1'));

        $receipt = $this->asOwner($this->open($runtime, 1000));

        $view = TerminalView::query()->ownedBy($this->owner())->sole();
        $this->assertSame([$view->id, $runtime->id, 1000, 30], [
            $receipt->viewId,
            $receipt->runtimeId,
            $receipt->intervalMs,
            $receipt->expiresInSeconds,
        ]);
        $this->assertTrue($view->isLive());
        $this->assertNotSame(0, $watched->version('host-1'));
    }

    public function test_a_process_driver_agent_is_refused_and_no_view_is_made(): void
    {
        $runtime = $this->runtimeOn('host-1', DriverType::Process);

        $this->assertRefused(
            $this->open($runtime),
            'This agent runs without a terminal (process driver); there is nothing to watch.',
        );
    }

    public function test_a_stopped_agent_is_refused_with_the_time_its_terminal_ended(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $this->travelTo(CarbonImmutable::parse('2026-11-19 14:02:00'));
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($runtime);

        $this->assertRefused($this->open($runtime), 'This agent is not running; its terminal ended at 14:02.');
    }

    public function test_more_than_the_limit_of_views_is_refused(): void
    {
        $runtime = $this->runtimeOn('host-1');

        for ($view = 0; $view < TerminalView::MAX_PER_VIEWER; $view++) {
            TerminalView::create($this->owner(), $runtime, 500, CarbonImmutable::now());
        }

        $this->assertRefused(
            $this->open($runtime),
            'You may have at most 20 terminal views open; close one first.',
            TerminalView::MAX_PER_VIEWER,
        );
    }

    public function test_an_unknown_agent_gets_the_answer_of_no_permission(): void
    {
        $unknown = new OpenTerminalView('no-such-agent');

        $this->assertRefused($unknown, 'You may not inspect this agent');
    }

    public function test_an_actor_without_inspect_is_refused_before_anything_is_read(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = TestActors::agentIdentity(9)->id;
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agentId),
            TestStartAuthority::forAgent($agentId),
        );

        $this->expectException(ActorNotAllowed::class);

        $this->app->make(CommandBus::class)->run($this->open($runtime));
    }

    public function test_renewing_moves_the_expiry_and_a_closed_view_is_opened_anew(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $clock = new FakeServerClock(CarbonImmutable::parse('2026-11-19 12:00:00'));
        $this->app->instance(ServerClock::class, $clock);
        $first = $this->asOwner($this->open($runtime));

        $clock->set(CarbonImmutable::parse('2026-11-19 12:00:10'));
        $renewed = $this->asOwner($this->renew($runtime));
        $this->assertSame($first->viewId, $renewed->viewId);
        $this->assertTrue(
            TerminalView::query()->ownedBy($this->owner())->findOrFail($first->viewId)->expires_at->equalTo(
                CarbonImmutable::parse('2026-11-19 12:00:40'),
            ),
        );

        $this->asOwner($this->close($runtime));
        $reopened = $this->asOwner($this->renew($runtime));
        $this->assertNotSame($first->viewId, $reopened->viewId);
        $this->assertSame(1, TerminalView::query()->ownedBy($this->owner())->live()->count());
    }

    public function test_closing_one_viewers_view_keeps_the_runtime_watched_until_the_last_one_closes(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $watched = $this->app->make(WatchedRuntimes::class);
        $other = TerminalView::create(TestActors::userIdentity(2), $runtime, 1000, CarbonImmutable::now());
        $this->asOwner($this->open($runtime));

        $this->asOwner($this->close($runtime));
        $this->assertSame([$runtime->id], array_column($watched->forHost('host-1'), 'runtimeId'));
        $this->assertTrue($other->refresh()->isLive());

        $other->close(CarbonImmutable::now());
        $this->assertSame([], $watched->forHost('host-1'));
    }

    public function test_the_watched_list_names_a_runtime_once_at_its_shortest_interval_per_host(): void
    {
        $watched = $this->app->make(WatchedRuntimes::class);
        $first = $this->runtimeOn('host-1');
        $elsewhere = $this->runtimeOn('host-2');
        TerminalView::create(TestActors::userIdentity(1), $first, 1000, CarbonImmutable::now());
        TerminalView::create(TestActors::userIdentity(2), $first, 500, CarbonImmutable::now());
        TerminalView::create(TestActors::userIdentity(1), $elsewhere, 1000, CarbonImmutable::now());

        $listed = $watched->forHost('host-1');

        $this->assertCount(1, $listed);
        $this->assertSame([$first->id, 500], [$listed[0]->runtimeId, $listed[0]->intervalMs]);
        $this->assertSame([], $watched->forHost('host-3'));
        $this->assertSame(WatchedRuntimes::versionOf($listed), $watched->version('host-1'));
        $this->assertSame(0, $watched->version('host-3'));
        $otherVersion = $watched->version('host-2');
        TerminalView::create(TestActors::userIdentity(3), $first, 500, CarbonImmutable::now());
        $this->assertSame($otherVersion, $watched->version('host-2'));
    }

    public function test_the_runtime_status_counts_its_watchers_and_names_its_driver(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $first = TerminalView::create(TestActors::userIdentity(1), $runtime, 500, CarbonImmutable::now());
        TerminalView::create(TestActors::userIdentity(2), $runtime, 500, CarbonImmutable::now());

        $read = AgentRuntime::query()->withWatchers()->with('session')->findOrFail($runtime->id);
        $status = $read->status(CarbonImmutable::now());
        $this->assertSame([2, DriverType::Terminal], [$status->watchers, $status->driverType]);

        $first->close(CarbonImmutable::now());
        $reread = AgentRuntime::query()->with('session')->findOrFail($runtime->id);
        $this->assertSame(1, $reread->status(CarbonImmutable::now())->watchers);
    }

    private function open(AgentRuntime $runtime, int $intervalMs = 500): OpenTerminalView
    {
        return new OpenTerminalView($runtime->session->agent_id, $intervalMs);
    }

    private function renew(AgentRuntime $runtime): RenewTerminalView
    {
        return new RenewTerminalView($runtime->session->agent_id);
    }

    private function close(AgentRuntime $runtime): CloseTerminalView
    {
        return new CloseTerminalView($runtime->session->agent_id);
    }

    private function assertRefused(OpenTerminalView $command, string $message, int $views = 0): void
    {
        try {
            $this->asOwner($command);
            $this->fail('The view was opened.');
        } catch (TerminalViewRefused $refusal) {
            $this->assertSame($message, $refusal->getMessage());
        }

        $this->assertSame($views, TerminalView::query()->acrossActors()->count());
    }
}
