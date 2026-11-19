<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Resolvers\SessionRecords;
use App\Communication\Contracts\MessageAddressResolver;
use App\Communication\Exceptions\ActorCannotSend;

/**
 * Checks message addresses inside the running transaction: the recipient through the actor reader and, for an agent,
 * its locked session; the sender from the request's own actor and session.
 */
final readonly class MessageAddresses implements MessageAddressResolver
{
    public function __construct(
        private ActorResolver $actors,
        private CurrentActor $current,
        private CurrentSession $session,
        private SessionRecords $sessions,
    ) {}

    public function recipient(ActorIdentity $actor, string|null $sessionId): MessageAddress
    {
        if (! $this->actors->get($actor) instanceof ReceivesMessages) {
            throw ActorUnavailable::forIdentity($actor);
        }

        return match ($actor->type) {
            ActorType::Agent => $this->agentAddress($actor, $sessionId),
            ActorType::User => $sessionId === null ? MessageAddress::forUser($actor) : throw ActorUnavailable::forIdentity($actor),
            ActorType::System, ActorType::Engine => throw ActorUnavailable::forIdentity($actor),
        };
    }

    public function sender(): MessageAddress
    {
        $context = $this->current->actor();
        $identity = new ActorIdentity($context->actorType(), $context->actorId());

        if (! $this->actors->get($identity) instanceof SendsMessages) {
            throw ActorCannotSend::forIdentity($identity);
        }

        return match ($identity->type) {
            ActorType::Agent => MessageAddress::forAgent($identity, $this->session->sessionId()),
            ActorType::User => MessageAddress::forUser($identity),
            ActorType::System => MessageAddress::forSystem(),
            ActorType::Engine => throw ActorCannotSend::forIdentity($identity),
        };
    }

    private function agentAddress(ActorIdentity $agent, string|null $sessionId): MessageAddress
    {
        if ($sessionId === null) {
            throw ActorUnavailable::forIdentity($agent);
        }

        try {
            $this->sessions->lockEligibleSessionOf($agent->id, $sessionId);
        } catch (StackTargetRefused) {
            throw ActorUnavailable::forIdentity($agent);
        }

        return MessageAddress::forAgent($agent, $sessionId);
    }
}
