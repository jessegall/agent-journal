<?php

declare(strict_types=1);

namespace App\Communication\Support\Addresses;

use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Resolvers\SessionRecords;
use App\Communication\Contracts\MessageAddressProvider;
use App\Communication\Support\MessageAddress;

/**
 * An agent is addressed in one of its eligible sessions, and sends from the session of its signed call.
 */
final readonly class AgentAddresses implements MessageAddressProvider
{
    public function __construct(private SessionRecords $sessions, private CurrentSession $session) {}

    public function recipient(ActorIdentity $actor, string|null $sessionId): MessageAddress
    {
        if ($sessionId === null) {
            throw ActorUnavailable::forIdentity($actor);
        }

        try {
            $this->sessions->lockEligibleSessionOf($actor->id, $sessionId);
        } catch (StackTargetRefused) {
            throw ActorUnavailable::forIdentity($actor);
        }

        return MessageAddress::forAgent($actor, $sessionId);
    }

    public function sender(ActorIdentity $actor): MessageAddress
    {
        return MessageAddress::forAgent($actor, $this->session->sessionId());
    }
}
