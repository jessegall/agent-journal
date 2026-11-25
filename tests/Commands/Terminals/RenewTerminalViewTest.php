<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\CloseTerminalView\CloseTerminalViewCommand;
use App\Commands\Terminals\OpenTerminalView\OpenTerminalViewCommand;
use App\Commands\Terminals\RenewTerminalView\RenewTerminalViewCommand;
use App\Contracts\Time\ServerClock;
use App\Enums\Drivers\DriverType;
use App\Enums\Terminals\TerminalViewRefusal;
use App\Exceptions\TerminalViewRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalView;
use App\Support\AgentRuntimes;
use App\Support\AgentSessions;
use App\Support\StartSessions;
use App\Values\RuntimeIntent;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\FakeServerClock;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Renewing a view moves its expiry; a closed or lapsed view is refused, not reopened, and a delayed renew never
 * touches a sibling view on a replacement runtime.
 */
final class RenewTerminalViewTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_renewing_moves_the_expiry_and_a_closed_interest_is_refused_not_reopened(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $clock = new FakeServerClock(CarbonImmutable::parse('2026-11-19 12:00:00'));
        $this->app->instance(ServerClock::class, $clock);
        $first = $this->asOwner($this->open($runtime));

        $clock->set(CarbonImmutable::parse('2026-11-19 12:00:10'));
        $renewed = $this->asOwner($this->renew($runtime, $first->readInterestId));
        $this->assertSame($first->viewId, $renewed->viewId);
        $this->assertTrue(
            TerminalView::query()->ownedBy($this->owner())->findOrFail($first->viewId)->expires_at->equalTo(
                CarbonImmutable::parse('2026-11-19 12:00:40'),
            ),
        );

        $this->asOwner($this->close($runtime, $first->readInterestId));

        try {
            $this->asOwner($this->renew($runtime, $first->readInterestId));
            $this->fail('The closed interest was renewed.');
        } catch (TerminalViewRefused $refusal) {
            $this->assertSame(TerminalViewRefusal::InterestEnded, $refusal->refusal);
        }

        $this->assertSame(0, TerminalView::query()->ownedBy($this->owner())->live()->count());
    }

    public function test_a_lapsed_interest_is_refused_on_renewal(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $clock = new FakeServerClock(CarbonImmutable::parse('2026-11-19 12:00:00'));
        $this->app->instance(ServerClock::class, $clock);
        $first = $this->asOwner($this->open($runtime));
        $clock->set(CarbonImmutable::parse('2026-11-19 12:01:00'));

        $this->expectExceptionObject(TerminalViewRefused::interestEnded());

        $this->asOwner($this->renew($runtime, $first->readInterestId));
    }

    public function test_a_delayed_renew_and_close_of_one_interest_never_touch_its_sibling_on_a_replacement(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $clock = new FakeServerClock(CarbonImmutable::parse('2026-11-19 12:00:00'));
        $this->app->instance(ServerClock::class, $clock);
        $hidden = $this->asOwner($this->open($runtime));
        $sibling = $this->asOwner($this->open($runtime));
        $replacement = $this->replacementOf($runtime);
        $clock->set(CarbonImmutable::parse('2026-11-19 12:00:05'));
        $this->asOwner($this->close($runtime, $sibling->readInterestId));
        $advanced = $this->asOwner($this->open($replacement));
        $clock->set(CarbonImmutable::parse('2026-11-19 12:00:20'));

        $this->asOwner($this->renew($runtime, $hidden->readInterestId));
        $this->asOwner($this->close($runtime, $hidden->readInterestId));

        $view = TerminalView::query()->ownedBy($this->owner())->withReadInterest($advanced->readInterestId)->sole();
        $this->assertTrue($view->isLive());
        $this->assertSame($replacement->id, $view->agent_runtime_id);
        $this->assertTrue($view->expires_at->equalTo(CarbonImmutable::parse('2026-11-19 12:00:35')));
        $this->assertSame(1, TerminalView::query()->ownedBy($this->owner())->live()->count());
    }

    private function open(AgentRuntime $runtime, int $intervalMs = 500, string $requestId = ''): OpenTerminalViewCommand
    {
        return new OpenTerminalViewCommand($runtime->session->agent_id, $requestId ?: (string) Str::ulid(), $intervalMs);
    }

    private function renew(AgentRuntime $runtime, string $readInterestId): RenewTerminalViewCommand
    {
        return new RenewTerminalViewCommand($runtime->session->agent_id, $readInterestId);
    }

    private function close(AgentRuntime $runtime, string $readInterestId): CloseTerminalViewCommand
    {
        return new CloseTerminalViewCommand($runtime->session->agent_id, $readInterestId);
    }

    /**
     * The agent's session ends and a replacement session starts on the same host, with its own runtime.
     */
    private function replacementOf(AgentRuntime $runtime): AgentRuntime
    {
        $agent = Agent::query()->findOrFail($runtime->session->agent_id);
        $this->app->make(AgentSessions::class)->end($runtime->session);
        $agent->fenceRuntimes();
        $started = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId());
        $intent = new RuntimeIntent(
            'host-1',
            base_path(),
            'claude-code',
            '1.0.0',
            'default',
            DriverType::Terminal,
            null,
            null,
            null,
        );
        [$replacement] = $this->app->make(AgentRuntimes::class)->open($started->session, $intent, 'start-token-2');

        return $replacement->load('session');
    }
}
