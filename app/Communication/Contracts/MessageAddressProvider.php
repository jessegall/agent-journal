<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Communication\Support\MessageAddress;

/**
 * How one type of actor is addressed, as a recipient and as a sender.
 */
interface MessageAddressProvider
{
    /**
     * @throws ActorUnavailable
     */
    public function recipient(ActorIdentity $actor, string|null $sessionId): MessageAddress;

    public function sender(ActorIdentity $actor): MessageAddress;
}
