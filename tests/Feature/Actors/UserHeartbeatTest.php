<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Models\UserPresence;
use App\Actors\Support\DatabaseClock;
use App\Actors\Support\PresenceWindow;
use Domain\Access\Models\User;
use Illuminate\Support\Facades\Schema;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A signed-in viewer's heartbeat keeps one presence row per user, however many tabs or devices beat; a guest writes
 * nothing; a row counts as present only while its beat plus the window is strictly later than the observation time.
 */
final class UserHeartbeatTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;

    private const array TABLES = ['users', 'user_presences'];

    public function test_a_signed_in_user_beat_writes_the_one_row_of_that_user(): void
    {
        $this->actingAs($this->owner)->post('/presence/heartbeat')->assertNoContent();
        $first = UserPresence::query()->sole()->last_heartbeat_at;

        $this->actingAs($this->owner)->post('/presence/heartbeat')->assertNoContent();
        $this->actingAs($this->owner)->post('/presence/heartbeat')->assertNoContent();

        $presence = UserPresence::query()->sole();
        $this->assertSame($this->owner->id, $presence->user_id);
        $this->assertTrue($presence->last_heartbeat_at->greaterThanOrEqualTo($first));
    }

    public function test_a_guest_beat_writes_no_row(): void
    {
        $response = $this->post('/presence/heartbeat');

        $this->assertContains($response->getStatusCode(), [302, 401]);
        $this->assertSame(0, UserPresence::query()->count());
    }

    public function test_a_row_is_fresh_only_while_its_beat_plus_the_window_is_later_than_the_observation(): void
    {
        $window = $this->app->make(PresenceWindow::class);
        $now = $this->app->make(DatabaseClock::class)->now()->startOfSecond();
        UserPresence::recordFor($this->owner->id, $now);

        $this->assertSame(
            1,
            UserPresence::query()->freshAt($now->addSeconds($window->presenceSeconds - 1), $window)->count(),
        );
        $this->assertSame(
            0,
            UserPresence::query()->freshAt($now->addSeconds($window->presenceSeconds), $window)->count(),
        );
    }

    public function test_the_presence_table_indexes_its_beat(): void
    {
        $indexes = array_map(fn (array $index) => $index['columns'], Schema::getIndexes('user_presences'));

        $this->assertContains(['user_id'], $indexes);
        $this->assertContains(['last_heartbeat_at'], $indexes);
    }
}
