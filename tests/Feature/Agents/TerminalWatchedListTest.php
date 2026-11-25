<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Models\Drivers\TerminalView;
use App\Support\WatchedRuntimes;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The host's list of watched runtimes names each runtime once, at its shortest interval, per host.
 */
final class TerminalWatchedListTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    public function test_the_watched_list_names_a_runtime_once_at_its_shortest_interval_per_host(): void
    {
        $watched = $this->app->make(WatchedRuntimes::class);
        $first = $this->runtimeOn('host-1');
        $elsewhere = $this->runtimeOn('host-2');
        TerminalView::create(TestActors::userIdentity(1), $first, 1000, CarbonImmutable::now(), (string) Str::ulid());
        TerminalView::create(TestActors::userIdentity(2), $first, 500, CarbonImmutable::now(), (string) Str::ulid());

        TerminalView::create(
            TestActors::userIdentity(1),
            $elsewhere,
            1000,
            CarbonImmutable::now(),
            (string) Str::ulid(),
        );

        $listed = $watched->forHost('host-1');

        $this->assertCount(1, $listed);
        $this->assertSame([$first->id, 500], [$listed[0]->runtimeId, $listed[0]->intervalMs]);
        $this->assertSame([], $watched->forHost('host-3'));
        $this->assertSame(WatchedRuntimes::versionOf($listed), $watched->version('host-1'));
        $this->assertSame(0, $watched->version('host-3'));
        $otherVersion = $watched->version('host-2');
        TerminalView::create(TestActors::userIdentity(3), $first, 500, CarbonImmutable::now(), (string) Str::ulid());
        $this->assertSame($otherVersion, $watched->version('host-2'));
    }
}
