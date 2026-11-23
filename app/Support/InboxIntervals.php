<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\Inbox;
use App\Enums\IntervalRole;
use App\Enums\LeaveReason;
use App\Enums\TimelineEventType;
use App\Exceptions\ChatStateConflict;
use App\Exceptions\InboxUnavailable;
use App\Models\InboxInterval;
use App\Models\InboxRecord;
use App\Models\TimelineEvent;
use Carbon\CarbonImmutable;

/**
 * Joining and leaving a chat inbox under its row lock: each change takes the inbox's next timeline position, opens or
 * ends the member's interval and writes the event at that position. Joining an actor already active changes nothing.
 */
final readonly class InboxIntervals
{
    /**
     * The actor's active interval, opened at the next position with its joined event, or the one it already holds.
     *
     * @throws InboxUnavailable
     */
    public function enter(Inbox $inbox, ActorIdentity $actor, IntervalRole $role): ChatInterval
    {
        $this->lock($inbox);

        $active = InboxInterval::query()->activeFor($inbox->inboxId())->heldBy($actor)->first();

        if ($active !== null) {
            return $active->chatInterval;
        }

        $sequence = InboxRecord::lockedForSequence($inbox->inboxId())->takeSequence();
        $interval = InboxInterval::create($inbox->inboxId(), $actor, $role, $sequence);
        TimelineEvent::create($inbox->inboxId(), $sequence, TimelineEventType::Joined, $actor, $interval->id);

        return $interval->chatInterval;
    }

    /**
     * Ends the member's interval at the next position, with its left event.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function leave(ChatInterval $interval, LeaveReason $reason): void
    {
        $sequence = InboxRecord::lockedForSequence($interval->inboxId)->takeSequence();
        $record = InboxInterval::lockedById($interval->intervalId);
        $record->end($reason, CarbonImmutable::now());

        TimelineEvent::create(
            $interval->inboxId,
            $sequence,
            TimelineEventType::Left,
            $interval->actor,
            $interval->intervalId,
        );
    }

    /**
     * Passes the owner role from one active member to another at the next position, with its transferred event.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function transfer(ChatInterval $from, ChatInterval $to): void
    {
        $sequence = InboxRecord::lockedForSequence($from->inboxId)->takeSequence();

        InboxInterval::lockedById($from->intervalId)
            ->takeRole(IntervalRole::Member);

        InboxInterval::lockedById($to->intervalId)
            ->takeRole(IntervalRole::Owner);

        TimelineEvent::create($from->inboxId, $sequence, TimelineEventType::Transferred, $to->actor, $to->intervalId);
    }

    /**
     * Records that the chat closed, at the next position.
     *
     * @throws InboxUnavailable
     */
    public function recordClosed(Inbox $inbox, ActorIdentity $closedBy): void
    {
        $sequence = InboxRecord::lockedForSequence($inbox->inboxId())->takeSequence();
        TimelineEvent::create($inbox->inboxId(), $sequence, TimelineEventType::Closed, $closedBy, null);
    }

    /**
     * @throws InboxUnavailable
     */
    private function lock(Inbox $inbox): void
    {
        InboxRecord::lockedById($inbox->inboxId());
    }
}
