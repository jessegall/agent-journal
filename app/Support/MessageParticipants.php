<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Messages\MessageReceiver;
use App\Contracts\Messages\MessageSender;
use App\Exceptions\MessageParticipantRefused;

/**
 * The model behind the actor in hand, as the sender or the reader of messages; an actor that is neither is refused.
 */
final readonly class MessageParticipants
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
