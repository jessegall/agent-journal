<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Bus\Support\AcceptedReceipt;
use App\Communication\Commands\AskChatQuestion;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Commands\ReplyInChat;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Enums\TimelineEventType;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageRequestConflict;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\TimelineEvent;
use Closure;

/**
 * The one path a chat message takes: the chat inbox locked, the author's active interval required, a retried request
 * answered with the message it already made, then the timeline position, the message, one receipt per active member
 * with the author's shown, and a delivery for each agent member, all in the command's transaction.
 */
final readonly class ChatPosting
{
    public function __construct(
        private InboxResolver $inboxes,
        private AcceptedReceipt $accepted,
        private ReceiptDeliveries $deliveries,
        private CurrentSession $session,
    ) {}

    public function post(PostChatMessage $command): string
    {
        return $this->accept(
            $this->inboxes->resolve($command->inboxId),
            $command->dispatchedBy(),
            $command->requestKey,
            fn (Inbox $inbox, ActorIdentity $author) => ChatEnvelope::post(
                $inbox,
                $author,
                MessageBody::from($command->body),
                $command->requestKey,
            ),
        );
    }

    public function ask(AskChatQuestion $command): string
    {
        return $this->accept(
            $this->inboxes->resolve($command->inboxId),
            $command->dispatchedBy(),
            $command->requestKey,
            fn (Inbox $inbox, ActorIdentity $author) => ChatEnvelope::ask(
                $inbox,
                $author,
                MessageBody::from($command->body),
                $command->respondent(),
                $command->requestKey,
            ),
        );
    }

    /**
     * A reply lands in its parent's inbox; a parent the author cannot see, or one in another inbox than the one named,
     * is refused as missing.
     *
     * @throws MessageMissing
     */
    public function reply(ReplyInChat $command): string
    {
        $parent = Message::visibleById($command->parentId);

        if (! $parent->isChat() || $command->namesAnotherInboxThan($parent->destination_inbox_id)) {
            throw MessageMissing::forId($command->parentId);
        }

        return $this->accept(
            $this->inboxes->resolve($parent->destination_inbox_id),
            $command->dispatchedBy(),
            $command->requestKey,
            fn (Inbox $inbox, ActorIdentity $author) => ChatEnvelope::reply(
                $inbox,
                $author,
                MessageBody::from($command->body),
                $parent,
                $command->requestKey,
            ),
        );
    }

    /**
     * @param  Closure(Inbox, ActorIdentity): ChatEnvelope  $envelope
     *
     * @throws InboxUnavailable
     * @throws MessageRequestConflict
     */
    private function accept(Inbox $inbox, ActorContext $author, string $requestKey, Closure $envelope): string
    {
        $access = $this->inboxes->accessFor($inbox);
        $access->lockExclusive($inbox);
        $intervalId = $access->membership($inbox, $author)->interval();
        $identity = ActorIdentity::of($author);
        $chat = $envelope($inbox, $identity);

        $earlier = Message::postedUnderKey($inbox->inboxId(), $identity, $requestKey);

        if ($earlier !== null) {
            return $this->retried($earlier, $chat, $intervalId);
        }

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

        $this->writeReceipts($message, $inbox, $intervalId);

        return $message->id;
    }

    /**
     * The message a request already made, when the retry asks for the same message from the same interval.
     *
     * @throws MessageRequestConflict
     * @throws MessageMissing
     */
    private function retried(Message $earlier, ChatEnvelope $chat, string $intervalId): string
    {
        if (! $earlier->hasDigest($chat->digest())) {
            throw MessageRequestConflict::forKey($chat->requestKey);
        }

        $postedFrom = TimelineEvent::query()->whereKey($earlier->timeline_event_id)->value('interval_id');

        if ($postedFrom !== $intervalId) {
            throw MessageMissing::forId($earlier->id);
        }

        return $earlier->id;
    }

    private function writeReceipts(Message $message, Inbox $inbox, string $senderIntervalId): void
    {
        $intervals = InboxInterval::query()
            ->activeFor($inbox->inboxId())
            ->limit(InboxMembers::LIMIT)
            ->get()
            ->all();

        $receipts = MessageReceipt::forAudience($message, array_values($intervals), $senderIntervalId);
        $this->deliveries->schedule($receipts);
    }
}
