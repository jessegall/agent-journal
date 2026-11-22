<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Bus\Support\AcceptedReceipt;
use App\Communication\Commands\AnswerChatQuestion;
use App\Communication\Commands\AskChatQuestion;
use App\Communication\Commands\DeclineChatQuestion;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Commands\ReplyInChat;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\TimelineEventType;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageRequestConflict;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Exceptions\SpeechRefused;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\TimelineEvent;
use Carbon\CarbonImmutable;
use Closure;

/**
 * The one path a chat message takes: the chat inbox locked, the author's active interval required, a retried request
 * answered with the message it already made, an agent's claim on its turn to speak checked, then the timeline
 * position, the message, one receipt per active member with the author's shown, a delivery for each agent member and
 * the turns a user's message opens, all in the command's transaction.
 */
final readonly class ChatPosting
{
    public function __construct(
        private InboxResolver $inboxes,
        private AcceptedReceipt $accepted,
        private ReceiptDeliveries $deliveries,
        private SpeechAllowance $speech,
        private CurrentSession $session,
    ) {}

    public function post(PostChatMessage $command): string
    {
        return $this->accept(
            $this->inboxes->resolve($command->inboxId),
            $command->dispatchedBy(),
            $command->claimToken,
            fn (Inbox $inbox, ActorIdentity $author) => ChatEnvelope::post(
                $inbox,
                $author,
                MessageBody::from($command->body),
                $command->requestKey,
            ),
        )->id;
    }

    public function ask(AskChatQuestion $command): string
    {
        return $this->accept(
            $this->inboxes->resolve($command->inboxId),
            $command->dispatchedBy(),
            $command->claimToken,
            fn (Inbox $inbox, ActorIdentity $author) => ChatEnvelope::ask(
                $inbox,
                $author,
                MessageBody::from($command->body),
                $command->respondent(),
                $command->requestKey,
            ),
        )->id;
    }

    /**
     * A reply lands in its parent's inbox; a parent the author cannot see, or one in another inbox than the one named,
     * is refused as missing. A reply to a question someone else asked that still waits is its answer and closes it.
     *
     * @throws MessageMissing
     */
    public function reply(ReplyInChat $command): string
    {
        $parent = $this->visibleParent($command->parentId, $command->inboxId);
        $author = $command->dispatchedBy();
        $answers = $parent->needsReply() && ! $parent->isWrittenBy(ActorIdentity::of($author));
        $body = MessageBody::from($command->body);
        $key = $command->requestKey;

        $reply = $this->accept(
            $this->inboxes->resolve($parent->destination_inbox_id),
            $author,
            $command->claimToken,
            fn (Inbox $inbox, ActorIdentity $identity) => $answers
                ? ChatEnvelope::answer($inbox, $identity, $body, $parent, $key)
                : ChatEnvelope::reply($inbox, $identity, $body, $parent, $key),
        );

        if ($answers) {
            $this->close($parent, $reply, $author);
        }

        return $reply->id;
    }

    /**
     * Answers a waiting question with a reply and closes it in the same transaction: one answer closes it, and a
     * second answer finds it closed.
     *
     * @throws MessageMissing
     * @throws MessageStateConflict
     */
    public function answer(AnswerChatQuestion $command): string
    {
        $question = $this->visibleParent($command->questionId, null);
        $author = $command->dispatchedBy();

        $reply = $this->accept(
            $this->inboxes->resolve($question->destination_inbox_id),
            $author,
            $command->claimToken,
            fn (Inbox $inbox, ActorIdentity $identity) => ChatEnvelope::answer(
                $inbox,
                $identity,
                MessageBody::from($command->body),
                $question,
                $command->requestKey,
            ),
        );

        $this->close($question, $reply, $author);

        return $reply->id;
    }

    /**
     * Closes the question with its answer, once: a retried answer finds it already closed by itself.
     *
     * @throws MessageStateConflict
     */
    private function close(Message $question, Message $answer, ActorContext $author): void
    {
        $locked = Message::lockedById($question->id);

        if ($locked->answer_message_id !== $answer->id) {
            $locked->answerWith($answer, ActorIdentity::of($author), CarbonImmutable::now());
        }
    }

    /**
     * Declines a waiting question with a reason: an agent spends the turn reserved for it, and the question closes
     * as declined.
     *
     * @throws MessageMissing
     * @throws SpeechRefused
     */
    public function decline(DeclineChatQuestion $command): void
    {
        $question = $this->visibleParent($command->questionId, null);
        $inbox = $this->inboxes->resolve($question->destination_inbox_id);
        $author = $command->dispatchedBy();
        $identity = ActorIdentity::of($author);

        $access = $this->inboxes->accessFor($inbox);
        $access->lockExclusive($inbox);
        $intervalId = $access->membership($inbox, $author)->interval();

        if ($identity->type->isAgent()) {
            $this->speech->declineWith($inbox, $identity, $intervalId, $command->claimToken, $question);
        }

        Message::lockedById($question->id)->dismissBy(
            $identity,
            DismissalType::Declined,
            $command->reason,
            CarbonImmutable::now(),
        );
    }

    /**
     * @param  Closure(Inbox, ActorIdentity): ChatEnvelope  $envelope
     *
     * @throws InboxUnavailable
     * @throws MessageRequestConflict
     * @throws SpeechRefused
     */
    private function accept(Inbox $inbox, ActorContext $author, string|null $claimToken, Closure $envelope): Message
    {
        $access = $this->inboxes->accessFor($inbox);
        $access->lockExclusive($inbox);
        $intervalId = $access->membership($inbox, $author)->interval();
        $identity = ActorIdentity::of($author);
        $chat = $envelope($inbox, $identity);

        $earlier = Message::postedUnderKey($inbox->inboxId(), $identity, $chat->requestKey);

        if ($earlier !== null) {
            return $this->retried($earlier, $chat, $intervalId);
        }

        $opportunity = $identity->type->isAgent()
            ? $this->speech->requireClaim($inbox, $identity, $intervalId, $claimToken, $chat)
            : null;
        $chat = $opportunity === null ? $chat : $chat->underRoot($opportunity->user_root_id);

        $sequence = InboxRecord::lockForSequence($inbox->inboxId());
        $event = TimelineEvent::append(
            $inbox->inboxId(),
            $sequence,
            TimelineEventType::Message,
            $identity,
            $intervalId,
        );
        $message = Message::createChat(
            $chat,
            $event,
            new AcceptedOperation($this->accepted->requireFor(self::class)),
            $author->type->isAgent() && $this->session->hasSession() ? $this->session->sessionId() : null,
        );

        $intervals = $this->writeReceipts($message, $inbox, $intervalId);
        $opportunity?->spend($message);

        if ($identity->type === ActorType::User) {
            $this->speech->openFor($message, $intervals);
        }

        return $message;
    }

    /**
     * The message a request already made, when the retry asks for the same message from the same interval.
     *
     * @throws MessageRequestConflict
     * @throws MessageMissing
     */
    private function retried(Message $earlier, ChatEnvelope $chat, string $intervalId): Message
    {
        if (! $earlier->hasDigest($chat->digest())) {
            throw MessageRequestConflict::forKey($chat->requestKey);
        }

        $postedFrom = TimelineEvent::query()->whereKey($earlier->timeline_event_id)->value('interval_id');

        if ($postedFrom !== $intervalId) {
            throw MessageMissing::forId($earlier->id);
        }

        return $earlier;
    }

    /**
     * The chat message the author can see, in the chat it names when it names one.
     *
     * @throws MessageMissing
     */
    private function visibleParent(string $parentId, string|null $inboxId): Message
    {
        $parent = Message::visibleById($parentId);

        if (! $parent->isChat() || ($inboxId !== null && $inboxId !== $parent->destination_inbox_id)) {
            throw MessageMissing::forId($parentId);
        }

        return $parent;
    }

    /**
     * Gives every active member a receipt of the message and schedules the agents' deliveries; answers the members.
     *
     * @return list<InboxInterval>
     */
    private function writeReceipts(Message $message, Inbox $inbox, string $senderIntervalId): array
    {
        $intervals = array_values(InboxInterval::query()
            ->activeFor($inbox->inboxId())
            ->limit(InboxMembers::LIMIT)
            ->get()
            ->all());

        $receipts = MessageReceipt::forAudience($message, $intervals, $senderIntervalId);
        $this->deliveries->schedule($receipts);

        return $intervals;
    }
}
