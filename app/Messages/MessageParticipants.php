<?php

declare(strict_types=1);

namespace App\Messages;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorResolver;
use App\Messages\Contracts\MessageParticipants as MessageParticipantsContract;
use App\Messages\Contracts\MessageReceiver;
use App\Messages\Contracts\MessageSender;
use App\Messages\Exceptions\MessageParticipantRefused;
use App\Support\ActorReference;

/**
 * The model behind the actor in hand, as the sender or the reader of messages; an actor that is neither is refused.
 */
final readonly class MessageParticipants implements MessageParticipantsContract
{
    public function __construct(private ActorResolver $actors) {}

    /**
     * @throws MessageParticipantRefused
     */
    public function sender(Actor $actor): MessageSender
    {
        $model = $this->actors->get(ActorReference::of($actor));

        if ($model instanceof MessageSender) {
            return $model;
        }

        throw MessageParticipantRefused::cannotSend($actor->actorType());
    }

    /**
     * @throws MessageParticipantRefused
     */
    public function reader(Actor $actor): MessageSender&MessageReceiver
    {
        $model = $this->actors->get(ActorReference::of($actor));

        if ($model instanceof MessageSender && $model instanceof MessageReceiver) {
            return $model;
        }

        throw MessageParticipantRefused::cannotRead($actor->actorType());
    }
}
