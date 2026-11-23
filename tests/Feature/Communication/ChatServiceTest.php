<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Commands\ReplyInChat\ReplyInChatCommand;
use App\Enums\MessageType;
use App\Exceptions\MessageRequestConflict;
use App\Models\Message;
use App\Models\MessageReceipt;
use App\Models\TimelineEvent;
use App\Support\ActorIdentity;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;
use Tests\Support\PresentsChatText;

/**
 * A chat message is one row both members of a pair see, at its own timeline position: a retry with the same key
 * answers the same message, and a different message under that key is refused and leaves the first as it was.
 */
final class ChatServiceTest extends MessagingTestCase
{
    use OpensPairChats;
    use PresentsChatText;

    private Conversation $chat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
    }

    public function test_the_user_and_the_agent_post_one_row_each_that_both_see(): void
    {
        $this->asOwner();
        $question = $this->runOnBus(new PostChatMessageCommand($this->chat->inbox_id, 'Can you look?', 'first-key'));

        $this->asAgent($this->builder);
        $token = $this->runOnBus($this->claimSpeech($this->chat->inbox_id, $question));
        $answer = $this->runOnBus(new ReplyInChatCommand($question, 'Looking now.', 'reply-key', null, $token));

        $this->assertSame($question, Message::visibleById($question)->id);

        $this->asOwner();
        $reply = Message::visibleById($answer);

        $this->assertSame(MessageType::Chat, $reply->message_type);
        $this->assertSame($question, $reply->reply_to_id);
        $this->assertSame($question, $reply->user_root_id);
        $this->assertSame($this->chat->inbox_id, $reply->source_inbox_id);
        $this->assertSame(2, MessageReceipt::query()->where('message_id', $answer)->count());
        $this->assertSame(
            [3, 4],
            TimelineEvent::query()->ofInbox($this->chat->inbox_id)->where('type', 'message')
                ->orderBy('sequence')->pluck('sequence')->all(),
        );
    }

    public function test_a_retry_answers_the_same_message_and_a_different_one_is_refused(): void
    {
        $this->asOwner();
        $first = $this->runOnBus(new PostChatMessageCommand($this->chat->inbox_id, 'Hello.', 'same-key'));
        $again = $this->runOnBus(new PostChatMessageCommand($this->chat->inbox_id, 'Hello.', 'same-key'));

        $this->assertSame($first, $again);

        $this->expectException(MessageRequestConflict::class);

        try {
            $this->runOnBus(new PostChatMessageCommand($this->chat->inbox_id, 'Something else.', 'same-key'));
        } finally {
            $this->assertSame('Hello.', Message::visibleById($first)->body);
            $this->assertSame(1, Message::query()->acrossInboxes()->where('request_key', 'same-key')->count());
        }
    }
}
