<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\ChatDepartures;
use App\Communication\Contracts\Inbox;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\LeaveReason;
use App\Communication\Exceptions\ChatStateConflict;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\Message;
use App\Communication\Models\ReceiptDelivery;
use App\Communication\Models\SpeechOpportunity;
use Carbon\CarbonImmutable;

/**
 * What a member leaving a chat takes with it, the same whether it left, was removed or the chat closed: its interval
 * ends, its pending wakes and open turns to speak are cancelled, and every question still waiting on it is closed
 * where all can see, because its respondent left.
 */
final readonly class IntervalChatDepartures implements ChatDepartures
{
    public const string RESPONDENT_LEFT = 'The member this question was asked of left the chat.';

    public function __construct(
        private InboxIntervals $intervals,
        private ChatInboxes $chats,
    ) {}

    /**
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function depart(ChatInterval $interval, LeaveReason $reason): void
    {
        $this->intervals->leave($interval, $reason);

        $deliveries = ReceiptDelivery::query()->pendingForInterval($interval->intervalId)->lockForUpdate()->get();

        foreach ($deliveries as $delivery) {
            $delivery->cancel();
        }

        foreach (SpeechOpportunity::query()->openOnInterval($interval->intervalId)->lockForUpdate()->get() as $turn) {
            $turn->cancel();
        }

        $waiting = Message::query()
            ->acrossInboxes()
            ->waitingOnRespondent($interval->inboxId, $interval->actor)
            ->lockForUpdate()
            ->get();

        foreach ($waiting as $question) {
            $question->dismissBy(
                ActorIdentity::system(),
                DismissalType::Cancelled,
                self::RESPONDENT_LEFT,
                CarbonImmutable::now(),
            );
        }
    }

    /**
     * Ends every member's interval as the chat closes, with all it takes along, and records the close.
     *
     * @throws InboxUnavailable
     * @throws ChatStateConflict
     */
    public function closeChat(Inbox $inbox, ActorIdentity $closedBy): void
    {
        foreach ($this->chats->activeIntervals($inbox) as $interval) {
            $this->depart($interval, LeaveReason::Closed);
        }

        $this->intervals->recordClosed($inbox, $closedBy);
    }
}
