<?php

declare(strict_types=1);

namespace Tests\Commands\Inboxes;

use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Models\Inboxes\InboxMember;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A provider opens its inbox with its members; opening it again finds the same inbox and adds only a member not yet
 * in it.
 */
#[TestsCommand(OpenInboxCommand::class)]
final class OpenInboxTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    public function test_an_inbox_opens_once_and_takes_each_member_once(): void
    {
        $this->journal->owner()->agent('Planner')->agent('Builder');
        $owner = $this->journal->actorCalled('Owner');
        $planner = $this->journal->actorCalled('Planner');
        $builder = $this->journal->actorCalled('Builder');

        $first = $this->journal->run(new OpenInboxCommand('tests.room', 'room-1', 'Room', [$owner, $planner]));
        $second = $this->journal->run(new OpenInboxCommand('tests.room', 'room-1', 'Room', [$planner, $builder]));

        $this->assertSame($first, $second);
        $this->assertSame(3, InboxMember::query()->withoutGlobalScopes()->where('inbox_id', $first)->count());
    }
}
