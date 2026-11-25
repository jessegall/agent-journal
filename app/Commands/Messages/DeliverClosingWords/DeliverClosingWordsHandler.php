<?php

declare(strict_types=1);

namespace App\Commands\Messages\DeliverClosingWords;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sessions\CurrentSession;
use App\Exceptions\ClosingWordsRefused;
use App\Models\Drivers\DriverTurn;
use App\Models\Messages\MessageReadEntry;
use App\Support\MessageParticipants;

/**
 * Sends the pending closing words under the turn's lock, into the inbox of the message the agent read last.
 */
final readonly class DeliverClosingWordsHandler implements CommandHandler
{
    public function __construct(
        private CurrentSession $session,
        private MessageParticipants $participants,
        private CommandBus $commands,
    ) {}

    /**
     * @throws ClosingWordsRefused
     */
    public function handle(DeliverClosingWordsCommand $command): string
    {
        $agent = $this->participants->reader($command->dispatchedBy());
        $turn = DriverTurn::withClosingWordsOf($this->session->sessionId()) ?? throw ClosingWordsRefused::noOffer();

        if ($turn->delivered_message_id !== null) {
            return $turn->delivered_message_id;
        }

        $words = $turn->closing_words ?? throw ClosingWordsRefused::noOffer();
        $lastRead = MessageReadEntry::query()->latestOf($agent)->withMessage()->first()
            ?? throw ClosingWordsRefused::nothingRead();
        $messageId = $this->commands->run(new SendMessageCommand($lastRead->message->inbox_id, $words));

        $turn->markClosingWordsDelivered($messageId, $agent->participantId());

        return $messageId;
    }
}
