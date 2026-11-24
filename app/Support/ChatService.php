<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\AnswerChatQuestion\AnswerChatQuestionCommand;
use App\Commands\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\DeclineChatQuestion\DeclineChatQuestionCommand;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Commands\ReplyInChat\ReplyInChatCommand;
use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Sessions\CurrentSession;
use App\Enums\DismissalType;
use App\Enums\TimelineEventType;
use App\Exceptions\ChatMessageRefused;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\MessageMissing;
use App\Exceptions\MessageRequestConflict;
use App\Exceptions\MessageStateConflict;
use App\Exceptions\RespondentRequired;
use App\Exceptions\SpeechRefused;
use App\Exceptions\StaleAddressee;
use App\Models\Chats\InboxInterval;
use App\Models\Chats\InboxRecord;
use App\Models\Chats\TimelineEvent;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReceipt;
use Carbon\CarbonImmutable;
use Closure;

/**
 * The one path a chat message takes: the chat inbox locked, the author's active interval required, a retried request
 * answered with the message it already made, an agent's claim on its turn to speak checked, then the timeline
 * position, the message, one receipt per active member with the author's shown, a delivery for each agent member and
 * the turns a user's message opens, all in the command's transaction.
 */
final readonly class ChatService
{
    public function __construct(
        private InboxResolver $inboxes,
        private AcceptedReceipt $accepted,
        private ReceiptDeliveryService $deliveries,
        private SpeechService $speech,
        private MessageBatchService $shown,
        private CurrentSession $session,
    ) {}

    public function post(PostChatMessageCommand $command): string
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
                $command->addressee(),
            ),
        )->id;
    }

    public function ask(AskChatQuestionCommand $command): string
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
     * is refused as missing. A reply by the respondent of a question that still waits is its answer and closes it;
     * anyone else's reply to it is a comment that leaves it waiting.
     *
     * @throws MessageMissing
     */
    public function reply(ReplyInChatCommand $command): string
    {
        $parent = $this->visibleParent($command->parentId, $command->inboxId);
        $author = $command->dispatchedBy();
        $identity = ActorIdentity::of($author);

        $answers = $parent->awaitsReply()
            && ! $parent->isWrittenBy($identity)
            && $parent->mayBeSettledBy($identity);

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
    public function answer(AnswerChatQuestionCommand $command): string
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
     * Records a reply the author already posted under a waiting chat question as its answer, and closes it.
     *
     * @throws MessageMissing
     * @throws MessageStateConflict
     */
    public function linkAnswer(Message $question, Message $reply, ActorContext $author): string
    {
        $answersQuestion = $reply->isChat() && $reply->reply_to_id === $question->id;

        if (! $answersQuestion || ! $reply->isWrittenBy(ActorIdentity::of($author))) {
            throw MessageMissing::forId($reply->id);
        }

        $this->close($question, $reply, $author);

        return $reply->id;
    }

    /**
     * Declines a waiting question with a reason: an agent spends the turn reserved for it, and the question closes
     * as declined.
     *
     * @throws MessageMissing
     * @throws SpeechRefused
     */
    public function decline(DeclineChatQuestionCommand $command): void
    {
        $question = $this->visibleParent($command->questionId, null);
        $inbox = $this->inboxes->resolve($question->destination_inbox_id);
        $author = $command->dispatchedBy();
        $identity = ActorIdentity::of($author);

        $access = $this->inboxes->accessFor($inbox);
        $access->lockExclusive($inbox);
        $intervalId = $access->membership($inbox, $author)->interval();

        if (! $question->mayBeSettledBy($identity)) {
            throw ChatMessageRefused::notRespondent($question->id);
        }

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
        $chat = $this->addressed($envelope($inbox, $identity), $inbox);

        $earlier = Message::postedUnderKey($inbox->inboxId(), $identity, $chat->requestKey);

        if ($earlier !== null) {
            return $this->retried($earlier, $chat, $intervalId);
        }

        $opportunity = $identity->type->isAgent()
            ? $this->speech->requireClaim($inbox, $identity, $intervalId, $claimToken, $chat)
            : null;

        $chat = $opportunity === null ? $chat : $chat->underRoot($opportunity->user_root_id);
        // An agent asking an agent takes the target's open turn now, or fails whole before anything is published.
        $targetTurn = $opportunity === null ? null : $this->speech->targetTurnFor($chat, $inbox);

        $sequence = InboxRecord::lockedForSequence($inbox->inboxId())->takeSequence();

        $event = TimelineEvent::create(
            $inbox->inboxId(),
            $sequence,
            TimelineEventType::Message,
            $identity,
            $intervalId,
        );

        $message = Message::create(
            $chat->placedAt($event),
            new AcceptedOperation($this->accepted->requireFor(self::class)),
            $author->type->isAgent() && $this->session->hasSession() ? $this->session->sessionId() : null,
        );

        $intervals = $this->writeReceipts($message, $inbox, $intervalId);
        $opportunity?->spend($message);
        $targetTurn?->reserveFor($message);

        if ($identity->type->isUser()) {
            $this->speech->openFor($message, $intervals);
        }

        if ($opportunity !== null) {
            $this->speech->handOff($message, $intervals);
            $this->shown->acknowledgeShownUnder($opportunity->user_root_id, $intervalId, CarbonImmutable::now());
        }

        return $message;
    }

    /**
     * The envelope with its addressee and respondent checked against the members now: both must be active members,
     * and a question names who settles it, implicitly the only other member of a pair.
     *
     * @throws StaleAddressee
     * @throws RespondentRequired
     */
    private function addressed(ChatEnvelope $chat, Inbox $inbox): ChatEnvelope
    {
        $members = array_values(array_map(
            fn (InboxInterval $interval) => $interval->actor,
            InboxInterval::query()->activeFor($inbox->inboxId())->limit(InboxMembers::LIMIT)->get()->all(),
        ));

        foreach ([$chat->addressee, $chat->respondent] as $named) {
            if ($named !== null && ! array_any($members, fn (ActorIdentity $member) => $member->isSameAs($named))) {
                throw StaleAddressee::forActor($named);
            }
        }

        if (! $chat->isQuestion() || $chat->respondent !== null) {
            return $chat;
        }

        $others = array_values(array_filter(
            $members,
            fn (ActorIdentity $member) => ! $member->isSameAs($chat->author),
        ));

        if (count($others) !== 1) {
            throw RespondentRequired::forInbox($inbox->inboxId());
        }

        return $chat->askedOf($others[0]);
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
