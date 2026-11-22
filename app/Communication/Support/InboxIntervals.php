<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Inbox;
use App\Communication\Enums\IntervalRole;
use App\Communication\Enums\LeaveReason;
use App\Communication\Enums\TimelineEventType;
use App\Communication\Exceptions\ChatStateConflict;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\TimelineEvent;
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
    public function join(Inbox $inbox, ActorIdentity $actor, IntervalRole $role): ChatInterval
    {
        $this->lock($inbox);

        $active = InboxInterval::query()->activeFor($inbox->inboxId())->heldBy($actor)->first();

        if ($active !== null) {
            return ChatInterval::of($active);
        }

        $sequence = InboxRecord::lockForSequence($inbox->inboxId());
        $interval = InboxInterval::open($inbox->inboxId(), $actor, $role, $sequence);
        TimelineEvent::append($inbox->inboxId(), $sequence, TimelineEventType::Joined, $actor, $interval->id);

        return ChatInterval::of($interval);
    }

    /**
     * Ends the member's interval at the next position, with its left event.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function leave(ChatInterval $interval, LeaveReason $reason): void
    {
        $sequence = InboxRecord::lockForSequence($interval->inboxId);
        $record = InboxInterval::query()->whereKey($interval->intervalId)->lockForUpdate()->firstOrFail();
        $record->end($reason, CarbonImmutable::now());
        TimelineEvent::append(
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
        $sequence = InboxRecord::lockForSequence($from->inboxId);
        InboxInterval::query()->whereKey($from->intervalId)->lockForUpdate()->firstOrFail()
            ->takeRole(IntervalRole::Member);
        InboxInterval::query()->whereKey($to->intervalId)->lockForUpdate()->firstOrFail()
            ->takeRole(IntervalRole::Owner);
        TimelineEvent::append($from->inboxId, $sequence, TimelineEventType::Transferred, $to->actor, $to->intervalId);
    }

    /**
     * Records that the chat closed, at the next position.
     *
     * @throws InboxUnavailable
     */
    public function recordClosed(Inbox $inbox, ActorIdentity $closedBy): void
    {
        $sequence = InboxRecord::lockForSequence($inbox->inboxId());
        TimelineEvent::append($inbox->inboxId(), $sequence, TimelineEventType::Closed, $closedBy, null);
    }

    /**
     * @throws InboxUnavailable
     */
    private function lock(Inbox $inbox): void
    {
        InboxRecord::query()->whereKey($inbox->inboxId())->lockForUpdate()->firstOr(
            fn () => throw InboxUnavailable::forId($inbox->inboxId()),
        );
    }
}
