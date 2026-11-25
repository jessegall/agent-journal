<?php

declare(strict_types=1);

namespace Tests\Commands\Inboxes;

use App\Commands\Inboxes\ProvisionActorInbox\ProvisionActorInboxCommand;
use App\Enums\Accounts\CommandEntry;
use App\Models\Access\User;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A new actor gets its personal inbox with itself as its member.
 */
final class ProvisionActorInboxTest extends TestCase
{
    use RefreshHookDatabase;

    private const string TRUSTED_ENTRY = 'desk install';

    public function test_the_actor_gets_its_personal_inbox_as_its_member(): void
    {
        $actor = ActorIdentity::of(User::factory()->create(['name' => 'Ada']));

        $this->journal->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, new ProvisionActorInboxCommand($actor, 'Ada'));

        $inbox = Inbox::findPersonalOf($actor);
        $this->assertTrue(InboxMember::isAttached($inbox->id, $actor));
        $this->assertSame('Ada', $inbox->label);
    }
}
