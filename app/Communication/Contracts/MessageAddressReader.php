<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\ActorCannotSend;
use App\Communication\Support\MessageAddress;
use App\Communication\Support\MessageAddresses;
use Illuminate\Container\Attributes\Bind;

/**
 * Turns who a message is for, and who sends it, into checked addresses. It grants no read or stack authority.
 */
#[Bind(MessageAddresses::class)]
interface MessageAddressReader
{
    /**
     * The recipient: an actor that can receive messages, and for an agent one of its own sessions that still accepts
     * them, locked for the send.
     *
     * @throws ActorUnavailable
     */
    public function recipient(ActorIdentity $actor, string|null $sessionId): MessageAddress;

    /**
     * The sender: the actor of this request, with its own session when it is an agent, never taken from input.
     *
     * @throws ActorCannotSend
     */
    public function sender(): MessageAddress;
}
