<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\ActorReader;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\MessageAddressReader;
use App\Communication\Exceptions\ActorCannotSend;

/**
 * Reads the sending and the receiving actor through the actor providers: what each actor can do with messages is the
 * capability its provider gives it, never a check of its type.
 */
final readonly class MessageAddresses implements MessageAddressReader
{
    public function __construct(private ActorReader $actors, private CurrentActor $current) {}

    public function recipient(ActorIdentity $actor): ReceivesMessages
    {
        $recipient = $this->actors->get($actor);

        return $recipient instanceof ReceivesMessages ? $recipient : throw ActorUnavailable::forIdentity($actor);
    }

    public function sender(): SendsMessages
    {
        $context = $this->current->actor();
        $identity = new ActorIdentity($context->actorType(), $context->actorId());
        $sender = $this->actors->get($identity);

        return $sender instanceof SendsMessages ? $sender : throw ActorCannotSend::forIdentity($identity);
    }
}
