<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\LeaveReason;
use App\Communication\Exceptions\ChatStateConflict;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Support\ChatInterval;

/**
 * Members leaving a chat with everything their presence held, and a chat closing with all its members.
 */
interface ChatDepartures
{
    /**
     * Ends the member's interval, with its pending deliveries and the questions only it could settle.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function depart(ChatInterval $interval, LeaveReason $reason): void;

    /**
     * Ends every member's interval as the chat closes, with all it takes along, and records the close.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function closeChat(Inbox $inbox, ActorIdentity $closedBy): void;
}
