<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\ActorCannotSend;
use App\Communication\Support\MessageAddresses;
use Illuminate\Container\Attributes\Bind;

/**
 * Turns who a message is for, and who sends it, into actors that can take part. A message goes to an actor, never to a
 * session (rule 37). It grants no read or stack authority.
 */
#[Bind(MessageAddresses::class)]
interface MessageAddressReader
{
    /**
     * The recipient: an actor that exists, is not retired and can receive messages.
     *
     * @throws ActorUnavailable
     */
    public function recipient(ActorIdentity $actor): ReceivesMessages;

    /**
     * The sender: the actor of this request, never taken from input, when it can send messages.
     *
     * @throws ActorCannotSend
     */
    public function sender(): SendsMessages;
}
