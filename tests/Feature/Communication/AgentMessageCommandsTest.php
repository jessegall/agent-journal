<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\AnswerMessage\AnswerMessageCommand;
use App\Commands\DismissMessage\DismissMessageCommand;
use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Commands\SelectMessage\SelectMessageCommand;
use App\Contracts\Chat\InboxResolver;
use App\Enums\MessageState;
use App\Events\MessageAnswered;
use App\Exceptions\MessageMissing;
use App\Models\AgentSession;
use App\Models\CommandReceipt;
use App\Models\Message;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\MessageBody;
use App\Support\MessageEnvelope;
use App\Support\ReceiptCaller;
use App\Support\ReceiptRetention;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use stdClass;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\MessagingTestCase;
use Tests\Support\SendsSignedCalls;

final class AgentMessageCommandsTest extends MessagingTestCase
{
    use SendsSignedCalls;

    private const string RELEASE_QUESTION = 'Which release should I prepare?';

    private const string DISMISSAL = 'Already decided.';

    public function test_select_changes_only_the_callers_selection_and_hides_other_messages(): void
    {
        $question = $this->ownerAsks($this->inboxIdOf($this->builder), 'Choose this request.');
        $this->asAgent($this->builder);
        $this->assertSame($question, $this->runOnBus(new SelectMessageCommand($question)));

        $this->asAgent($this->reviewer);
        $this->assertThrows(fn () => $this->runOnBus(new SelectMessageCommand($question)), MessageMissing::class);
        $this->assertSame($question, AgentSession::selectedMessage($this->builder->id));
        $this->assertNull(AgentSession::selectedMessage($this->reviewer->id));
        $this->assertNull($this->stored($question)->read_at);
        $this->assertSame(MessageState::WaitingForAnswer, $this->stored($question)->state);
    }

    public function test_a_keyed_reply_preserves_the_author_session_and_sends_only_once(): void
    {
        $question = $this->ownerAsks($this->inboxIdOf($this->builder), 'Can you build it?');
        $this->asAgent($this->builder);
        $command = new ReplyToMessageCommand($question, 0, 'I will build it.');
        $reply = $this->runOnBus($command, 'reply-once');

        $this->assertSame($reply, $this->runOnBus($command, 'reply-once'));
        $this->assertSame(1, Message::query()->acrossInboxes()->where('reply_to_id', $question)->count());
        $stored = $this->stored($reply);
        $this->assertSame($question, $stored->reply_to_id);
        $this->assertSame($this->builder->agent_id, $stored->sender_id);
        $this->assertSame($this->builder->id, $stored->sender_session_id);
    }

    public function test_only_the_recipient_can_link_its_durable_reply_to_a_waiting_question(): void
    {
        $question = $this->ownerAsks($this->inboxIdOf($this->builder), 'Is the work ready?');
        $this->asAgent($this->builder);
        $reply = $this->recordReply($this->stored($question));
        Event::fake([MessageAnswered::class]);

        $this->asAgent($this->reviewer);
        $this->assertThrows(fn () => $this->runOnBus(new AnswerMessageCommand($question, $reply->id)), MessageMissing::class);
        $this->assertThrows(fn () => $this->runOnBus(new DismissMessageCommand($question, 'Guess.')), MessageMissing::class);
        Event::assertNotDispatched(MessageAnswered::class);

        $this->asAgent($this->builder);
        $this->assertSame($reply->id, $this->runOnBus(new AnswerMessageCommand($question, $reply->id)));
        $this->assertSame($reply->id, $this->runOnBus(new AnswerMessageCommand($question, $reply->id)));
        $this->assertSame(MessageState::Answered, $this->stored($question)->state);
        $this->assertSame($reply->id, $this->stored($question)->answer_message_id);
        Event::assertDispatchedTimes(MessageAnswered::class, 1);
    }

    public function test_a_signed_question_is_addressed_to_the_owner_and_can_be_dismissed_with_a_reason(): void
    {
        $caller = TestStart::start();
        $this->inboxOf(ActorIdentity::of($caller->agent));
        $destination = $this->ownerInboxId();
        $question = $this->signed($caller, '/agent/communication/question', [
            'body' => self::RELEASE_QUESTION,
            'request_key' => 'ask-owner',
        ])->assertOk()->json('message_id');

        $this->asOwner();
        $message = Message::visibleById($question);
        $this->assertTrue($message->is_question);
        $this->assertSame($destination, $message->destination_inbox_id);
        $this->assertSame(self::RELEASE_QUESTION, $message->body);

        $this->runOnBus(new DismissMessageCommand($message->id, self::DISMISSAL));
        $this->assertSame(self::DISMISSAL, $this->stored($message->id)->dismissal_reason);
    }

    private function recordReply(Message $original): Message
    {
        $actor = ActorContext::forAgent($this->builder->agent_id);
        $receipt = CommandReceipt::create(
            ReceiptCaller::inSession($actor, $this->builder->id),
            (string) Str::ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $inboxes = $this->app->make(InboxResolver::class);

        return Message::create(
            MessageEnvelope::reply(
                $inboxes->resolve($original->destination_inbox_id),
                $inboxes->resolve($original->source_inbox_id),
                ActorIdentity::of($actor),
                MessageBody::from('Ready.'),
                $original->id,
            ),
            new AcceptedOperation($receipt->id),
            $this->builder->id,
        );
    }

    private function stored(string $messageId): Message
    {
        return Message::query()->acrossInboxes()->findOrFail($messageId);
    }
}
