<?php

declare(strict_types=1);

namespace Tests\Commands\Inboxes;

use App\Commands\Inboxes\LeaveInbox\LeaveInboxCommand;
use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Models\Inboxes\InboxMember;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A member leaves an inbox and is no longer attached; an actor that is not a member leaves nothing behind.
 */
#[TestsCommand(LeaveInboxCommand::class)]
final class LeaveInboxTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    public function test_the_members_named_leave_in_one_write_and_a_stranger_changes_nothing(): void
    {
        $this->journal->owner()->agent('Planner')->agent('Stranger');
        $planner = $this->journal->actorCalled('Planner');
        $inboxId = $this->journal->run(new OpenInboxCommand('tests.room', 'room-1', 'Room', [$this->journal->actorCalled('Owner'), $planner]));

        $this->journal->run(new LeaveInboxCommand($inboxId, [$planner, $this->journal->actorCalled('Stranger')]));

        $this->assertFalse(InboxMember::isAttached($inboxId, $planner));
        $this->assertTrue(InboxMember::isAttached($inboxId, $this->journal->actorCalled('Owner')));
    }
}
