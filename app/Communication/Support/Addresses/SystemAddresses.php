<?php

declare(strict_types=1);

namespace App\Communication\Support\Addresses;

use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\MessageAddressProvider;
use App\Communication\Support\MessageAddress;

/**
 * The journal itself sends messages and receives none.
 */
final readonly class SystemAddresses implements MessageAddressProvider
{
    public function recipient(ActorIdentity $actor, string|null $sessionId): MessageAddress
    {
        throw ActorUnavailable::forIdentity($actor);
    }

    public function sender(ActorIdentity $actor): MessageAddress
    {
        return MessageAddress::forSystem();
    }
}
