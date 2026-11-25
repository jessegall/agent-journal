<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Models\Access\User;
use App\Models\Presence\UserPresence;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A signed-in viewer's heartbeat keeps one presence row per user, however many tabs or devices beat; a guest writes
 * nothing; a row counts as present only while its beat plus the window is strictly later than the observation time.
 */
final class UserHeartbeatTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'user_presences'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_signed_in_user_beat_writes_the_one_row_of_that_user(): void
    {
        $this->actingAs($this->journal->ownerUser())->post('/presence/heartbeat')->assertNoContent();
        $first = UserPresence::query()->sole()->last_heartbeat_at;

        $this->actingAs($this->journal->ownerUser())->post('/presence/heartbeat')->assertNoContent();
        $this->actingAs($this->journal->ownerUser())->post('/presence/heartbeat')->assertNoContent();

        $presence = UserPresence::query()->sole();
        $this->assertSame($this->journal->ownerUser()->id, $presence->user_id);
        $this->assertTrue($presence->last_heartbeat_at->greaterThanOrEqualTo($first));
    }

    public function test_a_guest_beat_writes_no_row(): void
    {
        $this->journal->asGuest();
        $response = $this->post('/presence/heartbeat');

        $this->assertContains($response->getStatusCode(), [302, 401]);
        $this->assertSame(0, UserPresence::query()->count());
    }
}
