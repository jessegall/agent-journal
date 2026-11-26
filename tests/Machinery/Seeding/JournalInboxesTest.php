<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Commands\Notifications\MarkNotificationRead\MarkNotificationReadCommand;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorReference;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\TestCase;

/**
 * An inbox two actors share holds both and is found from either side; one with a name no actor holds, with oneself or
 * a second time is refused before anything is written, and a post takes the inbox's next number. The journal installs
 * its own inboxes, makes an actor's own inbox once, and keeps each notification it delivers by name, read or unread.
 */
final class JournalInboxesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_both_members_attach_and_either_order_finds_the_one_shared_inbox(): void
    {
        $this->journal->owner()->agent('Ada')->sharedInbox('Owner', 'Ada');

        $chat = $this->journal->sharedInboxOf('Ada', 'Owner');

        $this->assertSame($this->journal->sharedInboxOf('Owner', 'Ada')->id, $chat->id);
        $this->assertSame(2, InboxMember::query()->where('inbox_id', $chat->id)->count());
    }

    public function test_a_misspelled_name_shares_no_inbox(): void
    {
        $this->journal->owner();
        $inboxes = Inbox::query()->count();

        $this->assertThrows(fn () => $this->journal->sharedInbox('Owner', 'Adda'), FixtureRefused::class);

        $this->assertSame($inboxes, Inbox::query()->count());
    }

    public function test_an_inbox_shared_with_oneself_or_a_second_time_is_refused(): void
    {
        $this->journal->owner()->user('Sam')->sharedInbox('Owner', 'Sam');

        $this->assertThrows(
            fn () => $this->journal->sharedInbox('Sam', 'Owner'),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::OccupiedAlias,
        );
        $this->assertThrows(
            fn () => $this->journal->sharedInbox('Sam', 'Sam'),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::SelfShare,
        );
    }

    public function test_posts_take_the_next_numbers_of_the_inbox(): void
    {
        $this->journal->owner()->user('Sam')->sharedInbox('Owner', 'Sam');
        $chat = $this->journal->sharedInboxOf('Owner', 'Sam');

        $first = $this->journal->post('Owner', $chat, 'Hello');
        $second = $this->journal->post('Sam', $chat, 'Hi');

        $this->assertSame($first->number + 1, $second->number);
        $this->journal->assertMessageSent($chat, 'Owner', 'Hello')->assertMessageSent($chat, 'Sam', 'Hello', 0);
        $this->assertSame($chat->id, $this->journal->rememberInbox('Talk', $chat)->inboxCalled('Talk')->id);
    }

    public function test_the_journals_inboxes_install_with_the_main_inbox_among_them(): void
    {
        $this->journal->owner()->installInboxes();

        $this->assertTrue(Inbox::findMain()->exists);
    }

    public function test_a_seated_main_agent_is_the_main_inboxs_member(): void
    {
        $this->journal->owner()->installInboxes()->idleAgent('Main');
        $agent = $this->journal->agentCalled('Main');

        $this->journal->seatMainAgent($agent);

        $this->assertNotNull(InboxMember::findActive(Inbox::findMain()->id, ActorReference::of($agent)));
    }

    public function test_an_actors_own_inbox_is_made_once_and_found_again(): void
    {
        $owner = $this->journal->owner()->actorCalled('Owner');

        $inbox = $this->journal->inboxes()->personal($owner);

        $this->assertSame($inbox->id, $this->journal->inboxes()->personal($owner)->id);
        $this->assertTrue(InboxMember::isAttached($inbox->id, $owner));
    }

    public function test_run_outcome_notifications_stay_unread_until_their_recipient_reads_one(): void
    {
        $this->journal->owner()->notifyRunOutcomes('Owner', 1, 2)->assertUnreadNotifications('Owner', 2);

        $this->journal->run(new MarkNotificationReadCommand($this->journal->notificationCalled('Run 1')->id));

        $this->journal->assertNotificationRead('Run 1')
            ->assertNotificationUnread('Run 2')
            ->assertUnreadNotifications('Owner', 1);
        $this->assertThrows(fn () => $this->journal->assertNotificationRead('Run 2'), AssertionFailedError::class);
        $this->assertThrows(fn () => $this->journal->assertNotificationUnread('Run 1'), AssertionFailedError::class);
    }
}
