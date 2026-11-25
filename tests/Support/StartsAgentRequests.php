<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Actors\CurrentActorSetter;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\SignedCall;
use App\Values\InboxMemberAuthority;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;

/**
 * Starts a request as one agent and session, or as a user, the way the authenticating middleware binds them.
 */
trait StartsAgentRequests
{
    protected function startRequestAs(string $agentId, string $sessionId): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $agentId,
            $sessionId,
            new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
            null,
        ));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agentId),
            TestStartAuthority::forAgent($agentId),
        );
    }

    /**
     * Starts an agent's request as test agent $agent in its test session $session.
     */
    protected function startTestAgentRequest(int $agent, int $session): void
    {
        $this->startRequestAs(TestIds::of($agent), TestIds::of($session));
    }

    /**
     * Starts a user's request as test user $number.
     */
    protected function startTestUserRequest(int $number): void
    {
        $this->startUserRequestAs(TestIds::of($number));
    }

    protected function startUserRequestAs(string $userId): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings($userId));

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($userId), new OwnerAuthority('test'));
    }

    /**
     * Acts as an admitted user who is not the owner, under the chat-only authority its sign-in gives it.
     */
    protected function startChatMemberRequestAs(string $userId): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($userId), new InboxMemberAuthority('test'));
    }
}
