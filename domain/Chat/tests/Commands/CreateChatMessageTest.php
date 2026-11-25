<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Models\Inboxes\Inbox;
use Domain\Chat\Commands\CreateChatMessage\CreateChatMessageCommand;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Exceptions\ChatSourceRefused;
use Domain\Chat\Models\ChatMessage;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * A record with an author shows in a chat as a message of its type, kept with the record it shows; a source type the
 * journal does not know and a record without an author are refused and show nothing.
 */
final class CreateChatMessageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['messages', 'chat_messages'];

    private Inbox $chat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->chat('Owner', 'Planner');
        $this->chat = $this->journal->chatOf('Owner', 'Planner');
    }

    public function test_an_authored_record_shows_in_the_chat_as_a_message_of_its_type(): void
    {
        $source = $this->journal->post('Planner', $this->chat, 'The build is green.');

        $chatMessageId = $this->journal->run(
            new CreateChatMessageCommand($this->chat->id, $source->getMorphClass(), $source->id, ChatMessageType::Message),
        );

        $chatMessage = ChatMessage::query()->withoutGlobalScopes()->findOrFail($chatMessageId);

        $this->assertSame(
            [$this->chat->id, $source->getMorphClass(), $source->id, ChatMessageType::Message],
            [$chatMessage->inbox_id, $chatMessage->source_type, $chatMessage->source_id, $chatMessage->type],
        );
    }

    public function test_an_unknown_source_type_and_a_record_without_an_author_are_refused(): void
    {
        $before = ChatMessage::query()->withoutGlobalScopes()->count();

        $this->assertThrows(
            fn () => $this->journal->run(new CreateChatMessageCommand($this->chat->id, 'nowhere.thing', 'x', ChatMessageType::Event)),
            ChatSourceRefused::class,
        );

        $this->assertThrows(
            fn () => $this->journal->run(
                new CreateChatMessageCommand($this->chat->id, $this->chat->getMorphClass(), $this->chat->id, ChatMessageType::Event),
            ),
            ChatSourceRefused::class,
        );

        $this->assertSame($before, ChatMessage::query()->withoutGlobalScopes()->count());
    }
}
