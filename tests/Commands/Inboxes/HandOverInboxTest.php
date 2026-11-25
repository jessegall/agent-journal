<?php

declare(strict_types=1);

namespace Tests\Commands\Inboxes;

use App\Commands\Inboxes\HandOverInbox\HandOverInboxCommand;
use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Models\Inboxes\InboxMember;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\SeedsJournal;
use Tests\TestCase;

/**
 * A member hands its place in an inbox over to another actor, who joins as it leaves.
 */
final class HandOverInboxTest extends TestCase
{
    use CommitsHookRows;
    use SeedsJournal;

    private const array TABLES = [];

    public function test_the_new_actor_joins_as_the_old_one_leaves(): void
    {
        $this->journal()->owner()->agent('Planner')->agent('Builder');
        $planner = $this->journal()->actorCalled('Planner');
        $builder = $this->journal()->actorCalled('Builder');
        $inboxId = $this->journal()->run(new OpenInboxCommand('tests.room', 'room-1', 'Room', [$this->journal()->actorCalled('Owner'), $planner]));

        $this->journal()->run(new HandOverInboxCommand($inboxId, $planner, $builder));

        $this->assertSame(
            [false, true],
            [InboxMember::isAttached($inboxId, $planner), InboxMember::isAttached($inboxId, $builder)],
        );
    }
}
