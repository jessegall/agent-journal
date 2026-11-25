<?php

declare(strict_types=1);

namespace Tests\Commands\Inboxes;

use App\Commands\Inboxes\JoinInbox\JoinInboxCommand;
use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Models\Inboxes\InboxMember;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * An actor joins an inbox and is attached to it.
 */
final class JoinInboxTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    public function test_the_joined_actor_is_attached(): void
    {
        $this->journal->owner()->agent('Planner');
        $inboxId = $this->journal->run(new OpenInboxCommand('tests.room', 'room-1', 'Room', [$this->journal->actorCalled('Owner')]));

        $this->journal->run(new JoinInboxCommand($inboxId, $this->journal->actorCalled('Planner')));

        $this->assertTrue(InboxMember::isAttached($inboxId, $this->journal->actorCalled('Planner')));
    }
}
