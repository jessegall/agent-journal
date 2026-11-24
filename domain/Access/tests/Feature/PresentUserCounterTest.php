<?php

declare(strict_types=1);

namespace Domain\Access\Tests\Feature;

use App\Models\Presence\UserPresence;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Access\Support\PresentUserCounter;
use Domain\Access\Tests\TestCase;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;

/**
 * A user is present while their one row is fresh and they may still use the journal; their tabs and devices share the
 * row, so they count once, and the count is one query.
 */
final class PresentUserCounterTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;

    public function test_beats_from_two_tabs_count_one_user(): void
    {
        $this->beat($this->owner->id, CarbonImmutable::parse('2026-11-18 12:00:00'));
        $this->beat($this->owner->id, CarbonImmutable::parse('2026-11-18 12:00:10'));

        $this->assertSame(1, $this->countAt('2026-11-18 12:01:00'));
    }

    public function test_a_row_older_than_the_window_counts_zero(): void
    {
        $this->beat($this->owner->id, CarbonImmutable::parse('2026-11-18 12:00:00'));

        $this->assertSame(0, $this->countAt('2026-11-18 12:02:01'));
    }

    public function test_a_user_who_may_no_longer_use_the_journal_counts_zero(): void
    {
        $this->beat($this->owner->id, CarbonImmutable::parse('2026-11-18 12:00:00'));
        $this->app->instance(AccessSettings::class, new AccessSettings(null));

        $this->assertSame(0, $this->countAt('2026-11-18 12:01:00'));
    }

    public function test_the_count_is_one_query(): void
    {
        $this->beat($this->owner->id, CarbonImmutable::parse('2026-11-18 12:00:00'));
        $counter = $this->app->make(PresentUserCounter::class);
        $queries = 0;

        DB::listen(function (QueryExecuted $query) use (&$queries): void {
            $queries++;
        });

        $counter->count(CarbonImmutable::parse('2026-11-18 12:01:00'));

        $this->assertSame(1, $queries);
    }

    private function countAt(string $observedAt): int
    {
        return $this->app->make(PresentUserCounter::class)->count(CarbonImmutable::parse($observedAt));
    }

    private function beat(string $userId, CarbonImmutable $time): void
    {
        UserPresence::lockedFor($userId, $time)->beatAt($time);
    }
}
