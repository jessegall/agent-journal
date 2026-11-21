<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorContext;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Models\ClaimAuthorization;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\ProvedClaims;
use App\Bus\Contracts\CommandFacts;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Data\MessageReadResult;
use App\Communication\Events\MessageTakenUp;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use Carbon\CarbonImmutable;

/**
 * Reading an inbox's messages: the reader admitted under the inbox's shared guard, the first read of each message
 * kept, and each waiting message nobody validly holds taken up by the reader, proved by its seat.
 */
final readonly class MessageReading
{
    public function __construct(
        private InboxResolver $inboxes,
        private ProvedClaims $proved,
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
        private CommandFacts $facts,
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
        $firstRead = $message->acknowledge($membership, $now);

        $takenUp = $message->needsReply() && ! $held;

        if ($takenUp) {
            $this->takeUp($message, $membership);
        }

        return new MessageReadResult($message->id, $firstRead, $takenUp);
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
        ClaimAuthorization::forInbox($claim->reference, $membership->seatReference);
        $this->facts->publishAfterCommit(new MessageTakenUp($message->id, $membership->actor));
    }
}
