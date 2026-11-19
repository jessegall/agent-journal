<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Actors\Contracts\WorkStackProvider;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Models\AgentSession;
use Illuminate\Contracts\Container\Container;

/**
 * An agent works on the stack of the session its signed call came from; an agent acting outside a signed call has
 * none to admit.
 */
final readonly class AgentWorkStack implements WorkStackProvider
{
    private const int RUNNING_SESSIONS_READ = 20;

    public function __construct(private Container $container) {}

    /**
     * @return list<string>
     */
    public function sessionsToAdmit(): array
    {
        try {
            return [$this->container->make(CurrentSession::class)->sessionId()];
        } catch (AgentContextMissing) {
            return [];
        }
    }

    public function sessionsOf(ActorIdentity $actor): array
    {
        $sessions = AgentSession::query()->runningFor($actor->id)->orderBy('id')
            ->readLimit(self::RUNNING_SESSIONS_READ)
            ->pluck('id')->all();

        return array_values(array_map(strval(...), $sessions));
    }
}
