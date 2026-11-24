<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\AskMessage\AskMessageCommand;
use App\Commands\SendMessage\SendMessageCommand;
use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Sessions\AgentDirectory;
use App\Contracts\Sessions\CurrentSession;
use App\Data\Messages\MessageReadBatch;
use App\Data\Messages\MessageReadResult;
use App\Events\MessageClaimed;
use App\Exceptions\AnswerImpossible;
use App\Exceptions\ChatInboxRefused;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\MessageMissing;
use App\Exceptions\SessionOutdated;
use App\Models\Chats\InboxRecord;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReceipt;
use App\Models\Records\ClaimAuthorization;
use Carbon\CarbonImmutable;
use Closure;

/**
 * What is done with a message between inboxes. Sending: both inboxes locked in a fixed order, the author's membership
 * of the source, the message recorded under the accepted receipt, the destination's members asked to look, and the
 * fact after commit. Reading: the reader admitted under the inbox's shared guard; for desk mail the first read of each
 * message kept and each waiting message nobody validly holds claimed by the reader, proved by its seat; for a chat
 * the reader's own receipt of each message marked shown, once. Answering: a question closed with its durable reply.
 */
final readonly class MessageService
{
    public function __construct(
        private InboxResolver $inboxes,
        private AcceptedReceipt $accepted,
        private InboxAttention $attention,
        private CurrentSession $session,
        private AgentDirectory $agents,
        private ProvedClaims $proved,
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
        private CommandFacts $facts,
        private SpeechService $speech,
        private MessageClaims $claims,
    ) {}

    public function send(SendMessageCommand $command): string
    {
        return $this->deliver(
            $command->sourceInboxId,
            $command->destinationInboxId,
            $command->dispatchedBy(),
            fn (Inbox $source, Inbox $destination, ActorIdentity $author) => MessageEnvelope::send(
                $source,
                $destination,
                $author,
                MessageBody::from($command->body),
            ),
        )->id;
    }

    /**
     * @throws SessionOutdated when the user saw a session the agent no longer runs
     */
    public function ask(AskMessageCommand $command): string
    {
        if ($command->seenSession !== null) {
            $seen = $command->seenSession;
            $this->agents->visibleAgent($seen->agentId)->assertRuns($seen->sessionId, $seen->generation);
        }

        return $this->question(
            $command->sourceInboxId,
            $command->destinationInboxId,
            $command->body,
            $command->dispatchedBy(),
        )->id;
    }

    public function question(
        string $sourceInboxId,
        string $destinationInboxId,
        string $body,
        ActorContext $actor,
    ): Message {
        return $this->deliver(
            $sourceInboxId,
            $destinationInboxId,
            $actor,
            function (Inbox $source, Inbox $destination, ActorIdentity $author) use ($body): MessageEnvelope {
                if ($this->inboxes->membersOf($destination) === []) {
                    throw AnswerImpossible::forInbox($destination->inboxId());
                }

                return MessageEnvelope::ask($source, $destination, $author, MessageBody::from($body));
            },
        );
    }

    /**
     * Answers a message from its destination inbox back to its source inbox, written by the given author.
     */
    public function reply(Message $original, string $body, ActorContext $author): Message
    {
        return $this->deliver(
            $original->destination_inbox_id,
            $original->source_inbox_id,
            $author,
            fn (Inbox $source, Inbox $destination, ActorIdentity $author) => MessageEnvelope::reply(
                $source,
                $destination,
                $author,
                MessageBody::from($body),
                $original->id,
            ),
        );
    }

    /**
     * @param  Closure(Inbox, Inbox, ActorIdentity): MessageEnvelope  $envelope
     *
     * @throws InboxUnavailable
     * @throws ChatInboxRefused
     */
    private function deliver(
        string $sourceInboxId,
        string $destinationInboxId,
        ActorContext $author,
        Closure $envelope,
    ): Message {
        foreach ([$sourceInboxId, $destinationInboxId] as $inboxId) {
            if (InboxRecord::isChatInbox($inboxId)) {
                throw ChatInboxRefused::forDeskPosting($inboxId);
            }
        }

        $source = $this->inboxes->resolve($sourceInboxId);
        $destination = $this->inboxes->resolve($destinationInboxId);
        $this->lockShared([$source, $destination]);
        $this->assertSourceAccess($source, $author);

        $message = Message::create(
            $envelope($source, $destination, ActorIdentity::of($author)),
            new AcceptedOperation($this->accepted->requireFor(self::class)),
            $author->type->isAgent() && $this->session->hasSession() ? $this->session->sessionId() : null,
        );

        $this->attention->requestFor($destination, AttentionOrigin::message($message->id, $message->origin_receipt_id));

        return $message;
    }

    private function assertSourceAccess(Inbox $source, ActorContext $author): void
    {
        if (ActorIdentity::of($author)->isSameAs(ActorIdentity::system())
            && $source->inboxId() === $this->inboxes->named(InboxNotices::SYSTEM_INBOX)->inboxId()) {
            return;
        }

        $this->inboxes->accessFor($source)->membership($source, $author);
    }

    /**
     * Shared locks on both inboxes, always in order of their ids.
     *
     * @param  list<Inbox>  $inboxes
     */
    private function lockShared(array $inboxes): void
    {
        usort($inboxes, fn (Inbox $first, Inbox $second) => strcmp($first->inboxId(), $second->inboxId()));

        foreach ($inboxes as $inbox) {
            $this->inboxes->accessFor($inbox)->lockShared($inbox);
        }
    }

    /**
     * The inbox under its shared guard and the given reader's membership of it.
     *
     * @return array{Inbox, InboxMembership}
     *
     * @throws InboxUnavailable
     */
    public function admit(string $inboxId, ActorContext $reader): array
    {
        $inbox = $this->inboxes->resolve($inboxId);
        $access = $this->inboxes->accessFor($inbox);
        $access->lockShared($inbox);

        return [$inbox, $access->membership($inbox, $reader)];
    }

    /**
     * Reads the named messages of one inbox as the reader, each locked, in the order named; a message the inbox does
     * not hold is refused as missing.
     *
     * @param  list<string>  $ids
     *
     * @throws InboxUnavailable
     * @throws MessageMissing
     */
    public function readInInbox(string $inboxId, ActorContext $reader, array $ids): MessageReadBatch
    {
        [$inbox, $membership] = $this->admit($inboxId, $reader);

        $messages = Message::query()
            ->whereKey($ids)
            ->where('destination_inbox_id', $inbox->inboxId())
            ->lockForUpdate()
            ->readExactly(count($ids))
            ->get()
            ->keyBy('id');

        $missing = array_diff($ids, $messages->keys()->all());

        if ($missing !== []) {
            throw MessageMissing::forId((string) reset($missing));
        }

        return $this->read($membership, array_map(fn (string $id) => $messages[$id], $ids));
    }

    public function recipientOf(string $messageId, ActorContext $actor): InboxMembership
    {
        $destination = Message::visibleById($messageId)->destination_inbox_id;

        try {
            return $this->admit($destination, $actor)[1];
        } catch (InboxUnavailable $failure) {
            throw MessageMissing::forId($messageId, $failure);
        }
    }

    /**
     * The ids among the messages that a valid claim already holds.
     *
     * @param  list<string>  $ids
     * @return list<string>
     */
    public function heldIds(array $ids): array
    {
        return array_keys($this->proved->validClaimsOn(Message::LINK_TYPE, $ids));
    }

    /**
     * Reads messages already locked by the caller, in the order given.
     *
     * @param  list<Message>  $messages
     */
    public function read(InboxMembership $membership, array $messages): MessageReadBatch
    {
        $held = $this->heldIds(array_map(fn (Message $message) => $message->id, $messages));
        $now = CarbonImmutable::now();

        return new MessageReadBatch(array_map(
            fn (Message $message) => $this->readOne($message, $membership, $now, in_array($message->id, $held, true)),
            $messages,
        ));
    }

    private function readOne(
        Message $message,
        InboxMembership $membership,
        CarbonImmutable $now,
        bool $isHeld,
    ): MessageReadResult {
        if ($membership->isChat()) {
            // An agent's chat row is read only through a confirmed showing of its whole body, never by id.
            $shown = ! $membership->actor->isAgent()
                && $this->present($message, $membership->interval(), $now);

            $claimed = $message->awaitsReply()
                && $this->speech->claimTurnForQuestion($message, $membership->actor, $membership->interval(), $now);

            return new MessageReadResult($message->id, $shown, $claimed);
        }

        $firstRead = $message->acknowledge($membership, $now);

        $claimed = $message->awaitsReply() && ! $isHeld;

        if ($claimed) {
            $this->claim($message, $membership);
        }

        return new MessageReadResult($message->id, $firstRead, $claimed);
    }

    /**
     * Marks the reader's own receipt of a chat message shown; a message its interval never received changes nothing.
     */
    private function present(Message $message, string $intervalId, CarbonImmutable $now): bool
    {
        $receipt = MessageReceipt::query()->where('message_id', $message->id)->ofInterval($intervalId)->first();

        return $receipt !== null && $receipt->present($now);
    }

    /**
     * Replaces a stale claim with the reader's, proved by its seat at the inbox's desk.
     */
    private function claim(Message $message, InboxMembership $membership): void
    {
        $record = $message->assignmentIdentity();
        $stale = $this->store->lockCurrent($record);

        if ($stale->isDefined()) {
            $this->responsibilities->release($record, $stale->get()->reference);
        }

        $claim = $this->responsibilities->assign($record, AssigneeIdentity::ofActorIdentity($membership->actor));
        ClaimAuthorization::forInbox($claim->reference, $membership->deskSeat());
        $claimed = new MessageClaimed($message->id, $message->destination_inbox_id, $membership->actor);
        $this->facts->publishAfterCommit($claimed);
    }

    /**
     * Closes a question with its durable reply and releases its claim.
     */
    public function answer(Message $message, Message $reply, ActorIdentity $actor, CarbonImmutable $at): void
    {
        if ($message->answer_message_id === $reply->id) {
            return;
        }

        $message->answerWith($reply, $actor, $at);
        $this->claims->releaseAny($message);
    }
}
