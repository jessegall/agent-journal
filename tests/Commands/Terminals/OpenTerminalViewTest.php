<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\CloseTerminalView\CloseTerminalViewCommand;
use App\Commands\Terminals\OpenTerminalView\OpenTerminalViewCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\DriverType;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\TerminalViewRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalView;
use App\Support\ActorContext;
use App\Support\DriverRequestEndings;
use App\Support\WatchedRuntimes;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A viewer opens a live view of an agent's terminal, which tells the host's version; a process driver agent, a stopped
 * agent, a viewer past the limit of views, an unknown agent and an actor without inspect are refused, and a retried
 * request gives its first outcome.
 */
final class OpenTerminalViewTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_good_open_makes_one_live_view_of_the_viewer_and_changes_the_hosts_version(): void
    {
        $this->freezeTime();
        $runtime = $this->runtimeOn('host-1');
        $watched = $this->app->make(WatchedRuntimes::class);
        $this->assertSame(0, $watched->version('host-1'));

        $receipt = $this->asOwner($this->open($runtime, 1000));

        $view = TerminalView::query()->ownedBy($this->owner())->sole();
        $this->assertSame([$view->id, $view->read_interest_id, $runtime->id, 1000, 30, true], [
            $receipt->viewId,
            $receipt->readInterestId,
            $receipt->runtimeId,
            $receipt->intervalMs,
            $receipt->expiresInSeconds,
            $receipt->isLive,
        ]);
        $this->assertTrue($view->isLive());
        $this->assertNotSame(0, $watched->version('host-1'));
    }

    public function test_a_process_driver_agent_is_refused_and_no_view_is_made(): void
    {
        $runtime = $this->runtimeOn('host-1', DriverType::Headless);

        $this->assertRefused(
            $this->open($runtime),
            TerminalViewRefused::processDriver()->getMessage(),
        );
    }

    public function test_a_stopped_agent_is_refused_with_the_time_its_terminal_ended(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $this->travelTo(CarbonImmutable::parse('2026-11-19 14:02:00'));
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($runtime);

        $this->assertRefused(
            $this->open($runtime),
            TerminalViewRefused::notRunning(CarbonImmutable::parse('2026-11-19 14:02:00'))->getMessage(),
        );
    }

    public function test_more_than_the_limit_of_views_is_refused(): void
    {
        $runtime = $this->runtimeOn('host-1');

        for ($view = 0; $view < TerminalView::MAX_PER_VIEWER; $view++) {
            TerminalView::create($this->owner(), $runtime, 500, CarbonImmutable::now(), (string) Str::ulid());
        }

        $this->assertRefused(
            $this->open($runtime),
            TerminalViewRefused::tooManyViews()->getMessage(),
            TerminalView::MAX_PER_VIEWER,
        );
    }

    public function test_an_unknown_agent_gets_the_answer_of_no_permission(): void
    {
        $unknown = new OpenTerminalViewCommand('no-such-agent', (string) Str::ulid());

        $this->assertRefused($unknown, TerminalViewRefused::mayNotInspect()->getMessage());
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

    public function test_a_retried_open_request_gives_its_first_outcome_and_a_new_request_a_new_interest(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $requestId = (string) Str::ulid();
        $first = $this->asOwner($this->open($runtime, 500, $requestId));

        $retried = $this->asOwner($this->open($runtime, 500, $requestId));
        $this->asOwner($this->close($runtime, $first->readInterestId));
        $retriedAfterClose = $this->asOwner($this->open($runtime, 500, $requestId));
        $fresh = $this->asOwner($this->open($runtime));

        $this->assertSame($first->readInterestId, $retried->readInterestId);
        $this->assertSame(
            [$first->readInterestId, false],
            [$retriedAfterClose->readInterestId, $retriedAfterClose->isLive],
        );
        $this->assertNotSame($first->readInterestId, $fresh->readInterestId);
        $this->assertSame(2, TerminalView::query()->ownedBy($this->owner())->count());
    }

    private function open(AgentRuntime $runtime, int $intervalMs = 500, string $requestId = ''): OpenTerminalViewCommand
    {
        return new OpenTerminalViewCommand($runtime->session->agent_id, $requestId ?: (string) Str::ulid(), $intervalMs);
    }

    private function close(AgentRuntime $runtime, string $readInterestId): CloseTerminalViewCommand
    {
        return new CloseTerminalViewCommand($runtime->session->agent_id, $readInterestId);
    }

    private function assertRefused(OpenTerminalViewCommand $command, string $message, int $views = 0): void
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
