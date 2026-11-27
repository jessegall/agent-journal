<?php

declare(strict_types=1);

namespace App\Messages\Contracts;

use App\Actors\Contracts\Actor;
use App\Messages\Exceptions\MessageParticipantRefused;

/**
 * The actors that take part in messages, as senders and receivers.
 */
interface MessageParticipants
{
    /**
     * The actor as a participant that sends and receives messages.
     *
     * @throws MessageParticipantRefused
     */
    public function reader(Actor $actor): MessageSender&MessageReceiver;
}
