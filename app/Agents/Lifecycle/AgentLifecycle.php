<?php

declare(strict_types=1);

namespace App\Agents\Lifecycle;

use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Models\Agent;

/**
 * The one lock on an agent's row that orders its life: work given to it and launches take the shared lock, which
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
        $agent = Agent::query()->whereKey($agentId)->sharedLock()->first()
            ?? throw AgentNotAvailable::forAgent($agentId);

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
        return Agent::query()->whereKey($agentId)->lockForUpdate()->first()
            ?? throw AgentNotAvailable::forAgent($agentId);
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
