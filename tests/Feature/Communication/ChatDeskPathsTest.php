<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AskChatQuestion;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Commands\SendMessage;
use App\Communication\Commands\TakeNextMessages;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\ChatInboxRefused;
use App\Communication\Exceptions\ChatMessageRefused;
use App\Communication\Models\Message;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * The desk commands never write into a chat: a desk send to a chat inbox is refused, a chat post never turns into a
 * question afterwards, and a reply through the desk command to a chat question goes through the chat's own rules.
 */
final class ChatDeskPathsTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
    }

    public function test_a_desk_send_into_a_chat_inbox_is_refused(): void
    {
        $this->asOwner();

        $this->expectException(ChatInboxRefused::class);
        $this->runOnBus(new SendMessage($this->ownerInboxId(), $this->chat->inbox_id, 'Hello.'));
    }

    public function test_a_chat_post_never_becomes_a_question(): void
    {
        $this->asOwner();
        $postId = $this->runOnBus(new PostChatMessage($this->chat->inbox_id, 'Hello.', 'post-key'));

        $this->expectException(ChatMessageRefused::class);
        $this->runOnBus(new RequireMessageAnswer($postId));
    }

    public function test_an_agent_takes_up_the_pair_question_and_answers_it_through_the_desk_reply(): void
    {
        $this->asOwner();
        $questionId = $this->runOnBus(new AskChatQuestion($this->chat->inbox_id, 'Ready?', 'ask-key'));

        $this->asAgent($this->builder);
        $taken = $this->runOnBus(new TakeNextMessages($this->chat->inbox_id));
        $replyId = $this->runOnBus(new ReplyToMessage($questionId, null, 'Yes.'));

        $question = Message::query()->acrossInboxes()->findOrFail($questionId);

        $this->assertTrue($taken->messageReads[0]->takenUp);
        $this->assertSame([MessageState::Answered, $replyId], [$question->state, $question->answer_message_id]);
    }
}
