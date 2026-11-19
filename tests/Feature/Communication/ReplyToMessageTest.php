<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Communication\Commands\ReadMessages;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Enums\MessageState;
use App\Communication\Events\MessageAnswered;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Message;
use Illuminate\Support\Facades\Event;
use Tests\Support\MessagingTestCase;

/**
 * A member replies to a message at the version it saw: the reply goes back to the sender's inbox, a question is
 * answered and its claim released, and a reply to a version that moved on is refused.
 */
final class ReplyToMessageTest extends MessagingTestCase
{
    public function test_a_reply_answers_the_question_and_goes_back_to_the_senders_inbox(): void
    {
        Event::fake([MessageAnswered::class]);
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessages($this->inboxIdOf($this->builder), [$questionId]));

        $replyId = $this->runOnBus(new ReplyToMessage($questionId, $this->versionOf($questionId), 'Port 8080.'));

        $reply = Message::query()->findOrFail($replyId);
        $this->assertSame(MessageState::Answered, Message::query()->findOrFail($questionId)->state);
        $this->assertSame($this->inboxIdOf($this->builder), $reply->source_inbox_id);
        $this->assertSame($this->ownerInboxId(), $reply->destination_inbox_id);
        $this->assertSame($questionId, $reply->reply_to_id);
        $this->assertSame([], $this->claimsOn($questionId));
        Event::assertDispatched(
            MessageAnswered::class,
            fn (MessageAnswered $answered) => $answered->replyId === $replyId,
        );
    }

    public function test_a_reply_to_a_version_that_moved_on_is_refused(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);
        $stale = $this->versionOf($questionId);
        $this->runOnBus(new ReadMessages($this->inboxIdOf($this->builder), [$questionId]));
        $this->runOnBus(new ReplyToMessage($questionId, $this->versionOf($questionId), 'Done.'));

        $this->expectException(MessageStateConflict::class);

        $this->runOnBus(new ReplyToMessage($questionId, $stale, 'Again.'));
    }

    private function versionOf(string $messageId): int
    {
        return Message::query()->findOrFail($messageId)->state_version;
    }
}
