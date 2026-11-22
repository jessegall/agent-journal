<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxResolver;
use App\Data\MessageReadBatch;
use App\Data\MessageReadResult;
use App\Events\MessageTakenUp;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\MessageMissing;
use App\Models\ClaimAuthorization;
use App\Models\Message;
use App\Models\MessageReceipt;
use Carbon\CarbonImmutable;

/**
 * Reading an inbox's messages: the reader admitted under the inbox's shared guard; for desk mail the first read of
 * each message kept and each waiting message nobody validly holds taken up by the reader, proved by its seat; for a
 * chat the reader's own receipt of each message marked shown, once.
 */
final readonly class MessageReading
{
    public function __construct(
        private InboxResolver $inboxes,
        private ProvedClaims $proved,
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
        private CommandFacts $facts,
        private SpeechAllowance $speech,
    ) {}

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
        bool $held,
    ): MessageReadResult {
        if ($membership->isChat()) {
            // An agent's chat row is read only through a confirmed presentation of its whole body, never by id.
            $shown = ! $membership->actor->type->isAgent()
                && $this->present($message, $membership->interval(), $now);

            $takenUp = $message->needsReply()
                && $this->speech->claimOnTakeUp($message, $membership->actor, $membership->interval(), $now);

            return new MessageReadResult($message->id, $shown, $takenUp);
        }

        $firstRead = $message->acknowledge($membership, $now);

        $takenUp = $message->needsReply() && ! $held;

        if ($takenUp) {
            $this->takeUp($message, $membership);
        }

        return new MessageReadResult($message->id, $firstRead, $takenUp);
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
    private function takeUp(Message $message, InboxMembership $membership): void
    {
        $record = $message->assignmentIdentity();
        $stale = $this->store->lockCurrent($record);

        if ($stale->isDefined()) {
            $this->responsibilities->release($record, $stale->get()->reference);
        }

        $claim = $this->responsibilities->assign($record, AssigneeIdentity::ofActorIdentity($membership->actor));
        ClaimAuthorization::forInbox($claim->reference, $membership->deskSeat());
        $this->facts->publishAfterCommit(new MessageTakenUp($message->id, $membership->actor));
    }
}
