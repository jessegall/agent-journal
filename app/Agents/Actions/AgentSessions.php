<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Starts and ends the journal sessions of agents; a child session names its parent. A session starts under the
 * agent's shared lifecycle lock, inside the launch's transaction, so a retired agent never gets one and a retirement
 * waiting for the lock sees the new session.
 */
final readonly class AgentSessions
{
    public function __construct(private AgentLifecycle $lifecycle) {}

    /**
     * @throws LaunchRefused
     */
    public function start(Agent $agent, AgentSession|null $parent = null): AgentSession
    {
        try {
            $this->lifecycle->lockShared($agent->id);
        } catch (AgentNotAvailable $retired) {
            throw LaunchRefused::forRetiredAgent($agent->id, $retired);
        }

        $session = new AgentSession();
        $session->startFor($agent, $parent);

        return $session;
    }

    public function end(AgentSession $session): void
    {
        $session->endAt(CarbonImmutable::now());
    }
}
