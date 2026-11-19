<?php

declare(strict_types=1);

namespace App\Communication\Support\Addresses;

use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\MessageAddressProvider;
use App\Communication\Support\MessageAddress;

/**
 * A user is addressed without a session.
 */
final readonly class UserAddresses implements MessageAddressProvider
{
    public function recipient(ActorIdentity $actor, string|null $sessionId): MessageAddress
    {
        return $sessionId === null ? MessageAddress::forUser($actor) : throw ActorUnavailable::forIdentity($actor);
    }

    public function sender(ActorIdentity $actor): MessageAddress
    {
        return MessageAddress::forUser($actor);
    }
}
