<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Models\ClaimAuthorization;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\ProvedClaims;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Data\MessageReadResult;
use App\Communication\Events\MessageRead;
use App\Communication\Events\MessageTakenUp;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\Message;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Reading an inbox's messages: the reader admitted under the inbox's shared guard, the first read of each message
 * kept, and each waiting message nobody validly holds taken up by the reader, proved by its seat.
 */
final readonly class MessageReading
{
    public function __construct(
        private CurrentActor $actors,
        private InboxResolver $inboxes,
        private ProvedClaims $proved,
        private AssignmentStore $store,
        private ResponsibilityWriter $responsibilities,
        private Dispatcher $events,
    ) {}

    /**
     * The inbox under its shared guard and the reader's membership of it.
     *
     * @return array{Inbox, InboxMembership}
     *
     * @throws InboxUnavailable
     */
    public function admit(string $inboxId): array
    {
        $inbox = $this->inboxes->resolve($inboxId);
        $access = $this->inboxes->accessFor($inbox);
        $access->lockShared($inbox);

        return [$inbox, $access->membership($inbox, $this->actors->actor())];
    }

    /**
     * The ids among the messages that a valid claim already holds.
     *
     * @param  list<string>  $messageIds
     * @return list<string>
     */
    public function heldIds(array $messageIds): array
    {
        return array_keys($this->proved->validClaimsOn(Message::LINK_TYPE, $messageIds));
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

        if ($firstRead) {
            $this->events->dispatch(new MessageRead($message->id, $message->destination_inbox_id, $membership->actor));
        }

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
        $this->events->dispatch(new MessageTakenUp($message->id, $membership->actor));
    }
}
