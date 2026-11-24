<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Enums\IntervalRole;
use App\Enums\LeaveReason;
use App\Exceptions\ChatStateConflict;
use App\Exceptions\InboxUnavailable;
use App\Support\ActorIdentity;
use App\Support\ChatInterval;

/**
 * Joining and leaving a chat inbox under its row lock: each change takes the inbox's next timeline position, opens or
 * ends the member's interval and writes the event at that position.
 */
interface InboxIntervalWriter
{
    /**
     * The actor's active interval, opened at the next position with its joined event, or the one it already holds.
     *
     * @throws InboxUnavailable
     */
    public function enter(Inbox $inbox, ActorIdentity $actor, IntervalRole $role): ChatInterval;

    /**
     * Ends the member's interval at the next position, with its left event.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function leave(ChatInterval $interval, LeaveReason $reason): void;

    /**
     * Passes the owner role from one active member to another at the next position, with its transferred event.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function transfer(ChatInterval $from, ChatInterval $to): void;

    /**
     * Records that the chat closed, at the next position.
     *
     * @throws InboxUnavailable
     */
    public function recordClosed(Inbox $inbox, ActorIdentity $closedBy): void;
}
