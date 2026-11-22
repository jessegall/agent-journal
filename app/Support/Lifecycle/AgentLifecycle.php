<?php

declare(strict_types=1);

namespace App\Support\Lifecycle;

use App\Exceptions\AgentNotAvailable;
use App\Models\Agent;

/**
 * The one lock on an agent's row that orders its life: work given to it and starts take the shared lock, which
 * refuses a missing or retired agent; retirement takes the exclusive lock, so it waits for those to commit and they
 * wait for it. Callers hold it inside their own transaction.
 */
final readonly class AgentLifecycle
{
    /**
     * @throws AgentNotAvailable
     */
    public function lockShared(string $agentId): Agent
    {
        $agent = Agent::query()->whereKey($agentId)->sharedLock()->firstOr(
            fn () => throw AgentNotAvailable::forAgent($agentId),
        );

        if ($agent->isRetired()) {
            throw AgentNotAvailable::forAgent($agentId);
        }

        return $agent;
    }

    /**
     * @throws AgentNotAvailable
     */
    public function lockExclusive(string $agentId): Agent
    {
        return Agent::query()->whereKey($agentId)->lockForUpdate()->firstOr(
            fn () => throw AgentNotAvailable::forAgent($agentId),
        );
    }

    /**
     * The agent under an exclusive lock; a retired agent is refused.
     *
     * @throws AgentNotAvailable
     */
    public function lockExclusiveActive(string $agentId): Agent
    {
        $agent = $this->lockExclusive($agentId);

        if ($agent->isRetired()) {
            throw AgentNotAvailable::forAgent($agentId);
        }

        return $agent;
    }
}
