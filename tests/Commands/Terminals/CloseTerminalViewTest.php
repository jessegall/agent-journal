<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalView;
use App\Terminals\Commands\CloseTerminalView\CloseTerminalViewCommand;
use App\Terminals\Commands\OpenTerminalView\OpenTerminalViewCommand;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Closing one viewer's view keeps the runtime watched until the last one closes, and the runtime's status counts its
 * watchers.
 */
#[TestsCommand(CloseTerminalViewCommand::class)]
final class CloseTerminalViewTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_closing_one_viewers_view_keeps_the_runtime_watched_until_the_last_one_closes(): void
    {
        $runtime = $this->runtimeOn('host-1');

        $other = TerminalView::create(
            TestActors::userIdentity(2),
            $runtime,
            1000,
            CarbonImmutable::now(),
            (string) Str::ulid(),
        );

        $own = $this->asOwner($this->open($runtime));

        $this->asOwner($this->close($runtime, $own->readInterestId));
        $this->assertSame(1, $this->liveViewsOf($runtime->id));
        $this->assertTrue($other->refresh()->isLive());

        $other->close(CarbonImmutable::now());
        $this->assertSame(0, $this->liveViewsOf($runtime->id));
    }

    public function test_the_runtime_status_counts_its_watchers_and_names_its_driver(): void
    {
        $runtime = $this->runtimeOn('host-1');

        $first = TerminalView::create(
            TestActors::userIdentity(1),
            $runtime,
            500,
            CarbonImmutable::now(),
            (string) Str::ulid(),
        );

        TerminalView::create(TestActors::userIdentity(2), $runtime, 500, CarbonImmutable::now(), (string) Str::ulid());

        $read = AgentRuntime::query()->withWatchers()->with('session')->findOrFail($runtime->id);
        $status = $read->status(CarbonImmutable::now());
        $this->assertSame([2, true], [$status->watchers, $status->hasScreen]);

        $first->close(CarbonImmutable::now());
        $reread = AgentRuntime::query()->with('session')->findOrFail($runtime->id);
        $this->assertSame(1, $reread->status(CarbonImmutable::now())->watchers);
    }

    private function open(AgentRuntime $runtime, int $intervalMs = 500, string $requestId = ''): OpenTerminalViewCommand
    {
        return new OpenTerminalViewCommand($runtime->session->agent_id, $requestId ?: (string) Str::ulid(), $intervalMs);
    }

    private function close(AgentRuntime $runtime, string $readInterestId): CloseTerminalViewCommand
    {
        return new CloseTerminalViewCommand($runtime->session->agent_id, $readInterestId);
    }

    private function liveViewsOf(string $runtimeId): int
    {
        return TerminalView::query()->acrossActors()->live()->ofAgentRuntime($runtimeId)->count();
    }
}
