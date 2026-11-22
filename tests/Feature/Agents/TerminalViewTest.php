<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Models\AgentRuntime;
use App\Agents\Models\TerminalView;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A terminal view is one viewer's lease on a runtime's screen: opened for one lease, renewed, closed, and found lapsed
 * once its lease runs out unrenewed.
 */
final class TerminalViewTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_opening_stores_a_view_owned_by_the_viewer_live_for_one_lease(): void
    {
        $now = CarbonImmutable::parse('2026-11-19 12:00:00');
        $runtime = $this->runtime();

        $view = TerminalView::create(TestActors::userIdentity(1), $runtime, 500, $now, (string) Str::ulid());

        $stored = TerminalView::query()->ownedBy(TestActors::userIdentity(1))->findOrFail($view->id);
        $this->assertSame($runtime->id, $stored->agent_runtime_id);
        $this->assertSame($runtime->process_generation, $stored->process_generation);
        $this->assertSame(500, $stored->interval_ms);
        $this->assertTrue($stored->expires_at->equalTo($now->addSeconds(TerminalView::LEASE_SECONDS)));
        $this->assertTrue($stored->isLive());
        $this->assertFalse(TerminalView::query()->ownedBy(TestActors::userIdentity(2))->whereKey($view->id)->exists());
        $this->assertSame($view->id, $runtime->terminalViews()->acrossActors()->sole()->id);
    }

    public function test_renewing_moves_the_expiry_and_closing_ends_the_view(): void
    {
        $now = CarbonImmutable::parse('2026-11-19 12:00:00');
        $view = TerminalView::create(TestActors::userIdentity(1), $this->runtime(), 1000, $now, (string) Str::ulid());

        $view->renew($now->addSeconds(10));
        $this->assertTrue($view->refresh()->expires_at->equalTo($now->addSeconds(40)));

        $view->close($now->addSeconds(12));
        $this->assertFalse($view->refresh()->isLive());
        $this->assertTrue($view->closed_at->equalTo($now->addSeconds(12)));
    }

    public function test_lapsed_finds_only_live_views_past_their_expiry(): void
    {
        $now = CarbonImmutable::parse('2026-11-19 12:00:00');
        $runtime = $this->runtime();
        $lapsed = TerminalView::create(TestActors::userIdentity(1), $runtime, 500, $now, (string) Str::ulid());
        $renewed = TerminalView::create(TestActors::userIdentity(1), $runtime, 500, $now, (string) Str::ulid());
        $closed = TerminalView::create(TestActors::userIdentity(2), $runtime, 500, $now, (string) Str::ulid());
        $later = $now->addSeconds(TerminalView::LEASE_SECONDS + 1);
        $renewed->renew($now->addSeconds(20));
        $closed->close($now->addSeconds(5));

        $found = TerminalView::query()->acrossActors()->lapsed($later)->pluck('id')->all();

        $this->assertSame([$lapsed->id], $found);
        $this->assertEqualsCanonicalizing(
            [$lapsed->id, $renewed->id],
            TerminalView::query()->acrossActors()->live()->pluck('id')->all(),
        );
    }

    private function runtime(): AgentRuntime
    {
        $start = TestStart::start();
        $start->openRuntime($this->app);

        return AgentRuntime::query()->where('agent_session_id', $start->session->id)->sole();
    }
}
