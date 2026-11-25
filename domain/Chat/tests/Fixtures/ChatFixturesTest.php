<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures;

use App\Models\Inboxes\InboxMember;
use Domain\Chat\Commands\UnpinMessage\UnpinMessageCommand;
use Domain\Chat\Support\PairChats;
use Domain\Chat\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A pair chat arranged through the journal is the chat page's own pair chat with both members attached, and pins
 * belong to one member: taking away one's own pin leaves another member's, and the message stays in its inbox.
 */
final class ChatFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_pair_chat_is_the_chat_page_pair_chat_with_both_members_attached(): void
    {
        $this->journal->owner()->agent('Planner');
        $chats = $this->journal->fixtures(ChatFixtures::class);

        $chat = $chats->pairChat($this->journal->actorCalled('Owner'), $this->journal->actorCalled('Planner'));

        $this->assertSame(
            [
                PairChats::PAIR_PROVIDER,
                $chat->id,
            ],
            [
                $chat->provider_key,
                $chats->pairChatOf('Owner', 'Planner')->id,
            ],
        );
        $this->assertTrue(InboxMember::isAttached($chat->id, $this->journal->actorCalled('Owner')));
        $this->assertTrue(InboxMember::isAttached($chat->id, $this->journal->actorCalled('Planner')));
    }

    public function test_a_member_takes_away_only_their_own_pin_and_the_message_stays(): void
    {
        $this->journal->owner()->agent('Planner');
        $chat = $this->journal->fixtures(
            ChatFixtures::class,
        )->pairChatBetween('Owner', 'Planner')->pairChatOf('Owner', 'Planner');
        $message = $this->journal->post('Planner', $chat, 'Keep this.');

        $pins = $this->journal->fixtures(ChatFixtures::class)
            ->pin($chat, $message, 'Owner')
            ->pin($chat, $message, 'Planner');

        $this->journal->runAs('Owner', new UnpinMessageCommand($chat->id, $message->id));

        $pins->assertUnpinned($chat, $message, 'Owner')->assertPinned($chat, $message, 'Planner');
        $this->assertNull($pins->pinOf($chat, $message, 'Owner'));
        $this->assertSame($message->id, $pins->pinOf($chat, $message, 'Planner')?->message_id);
        $this->journal->assertMessageSent($chat, 'Planner', 'Keep this.');
    }
}
