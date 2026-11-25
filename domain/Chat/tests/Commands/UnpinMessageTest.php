<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Exceptions\MessageMissing;
use App\Models\Messages\Message;
use Domain\Chat\Commands\UnpinMessage\UnpinMessageCommand;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * A member takes away their own pin of a message and leaves another member's; a message outside the inbox is refused.
 */
final class UnpinMessageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'messages',
        'message_pins',
        'command_receipts',
    ];

    private string $chatId;

    private Message $message;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner');
        $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner');
        $this->chatId = $this->journal->fixtures(ChatFixtures::class)->pairChatOf('Owner', 'Planner')->id;
        $this->message = $this->journal->post(
            'Planner',
            $this->journal->fixtures(ChatFixtures::class)->pairChatOf('Owner', 'Planner'),
            'Keep this.',
        );
    }

    public function test_a_member_takes_away_their_own_pin_and_leaves_the_others(): void
    {
        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatOf('Owner', 'Planner');

        $pins = $this->journal->fixtures(ChatFixtures::class)
            ->pin($chat, $this->message, 'Owner')
            ->pin($chat, $this->message, 'Planner');

        $this->journal->actAs('Owner')->run(new UnpinMessageCommand($this->chatId, $this->message->id));

        $pins->assertUnpinned($chat, $this->message, 'Owner')->assertPinned($chat, $this->message, 'Planner');
    }

    public function test_a_message_outside_the_inbox_is_refused(): void
    {
        $own = $this->journal->inboxCalled('Owner');
        $elsewhere = $this->journal->post('Owner', $own, 'Mine.');

        $this->assertThrows(
            fn () => $this->journal->run(new UnpinMessageCommand($this->chatId, $elsewhere->id)),
            MessageMissing::class,
        );
    }
}
