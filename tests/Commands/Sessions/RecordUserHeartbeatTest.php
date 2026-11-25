<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Sessions\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use App\Models\Presence\UserPresence;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A signed-in user's page beats, and however often it beats the user keeps one presence with the time of the last.
 */
final class RecordUserHeartbeatTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_beats_keep_one_presence_for_the_user(): void
    {
        $this->journal->owner();
        $this->journal->run(new RecordUserHeartbeatCommand());
        $this->journal->run(new RecordUserHeartbeatCommand());

        $presence = UserPresence::query()->sole();
        $this->assertSame($this->journal->ownerUser()->id, $presence->user_id);
        $this->assertNotNull($presence->last_heartbeat_at);
    }
}
