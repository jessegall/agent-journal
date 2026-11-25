<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\CurrentSession;
use App\Contracts\Work\ActorStackSessionProvider as ActorStackSessionProviderContract;
use App\Models\Agents\AgentSession;

/**
 * An agent works on the stack of the session its signed call came from; an agent acting outside a signed call has
 * none to admit.
 */
final readonly class ActorStackSessionProvider implements ActorStackSessionProviderContract
{
    private const int RUNNING_SESSIONS_READ = 20;

    public function __construct(private CurrentSession $session) {}

    /**
     * @return list<string>
     */
    public function admittableSessions(): array
    {
        if ($this->session->hasSession()) {
            return [$this->session->sessionId()];
        }

        return [];
    }

    public function sessionsOf(ActorReference $actor): array
    {
        $sessions = AgentSession::query()->runningFor($actor->id)->oldestFirst()
            ->limit(self::RUNNING_SESSIONS_READ)
            ->pluck('id')->all();

        return array_values(array_map(strval(...), $sessions));
    }
}
