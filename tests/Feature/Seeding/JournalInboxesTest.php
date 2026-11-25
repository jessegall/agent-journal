<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\TestCase;

/**
 * A pair chat holds both its members and is found from either side; a chat with a name no actor holds, with oneself or
 * a second time is refused before anything is written, and a post takes the inbox's next number.
 */
final class JournalInboxesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_both_members_attach_and_either_order_finds_the_one_chat(): void
    {
        $this->journal->owner()->agent('Ada')->chat('Owner', 'Ada');

        $chat = $this->journal->chatOf('Ada', 'Owner');

        $this->assertSame($this->journal->chatOf('Owner', 'Ada')->id, $chat->id);
        $this->assertSame(2, InboxMember::query()->where('inbox_id', $chat->id)->count());
    }

    public function test_a_misspelled_name_opens_no_chat(): void
    {
        $this->journal->owner();
        $inboxes = Inbox::query()->count();

        $this->assertThrows(fn () => $this->journal->chat('Owner', 'Adda'), FixtureRefused::class);

        $this->assertSame($inboxes, Inbox::query()->count());
    }

    public function test_a_chat_with_oneself_or_a_second_time_is_refused(): void
    {
        $this->journal->owner()->user('Sam')->chat('Owner', 'Sam');

        $this->assertThrows(
            fn () => $this->journal->chat('Sam', 'Owner'),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::OccupiedAlias,
        );
        $this->assertThrows(
            fn () => $this->journal->chat('Sam', 'Sam'),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::SelfChat,
        );
    }

    public function test_posts_take_the_next_numbers_of_the_inbox(): void
    {
        $this->journal->owner()->user('Sam')->chat('Owner', 'Sam');
        $chat = $this->journal->chatOf('Owner', 'Sam');

        $first = $this->journal->post('Owner', $chat, 'Hello');
        $second = $this->journal->post('Sam', $chat, 'Hi');

        $this->assertSame($first->number + 1, $second->number);
        $this->journal->assertMessageSent($chat, 'Owner', 'Hello')->assertMessageSent($chat, 'Sam', 'Hello', 0);
        $this->assertSame($chat->id, $this->journal->rememberInbox('Talk', $chat)->inboxCalled('Talk')->id);
    }
}
