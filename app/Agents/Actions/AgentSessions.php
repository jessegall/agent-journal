<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Contracts\BuiltInLaunchProfiles;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\SelectedProgram;
use Carbon\CarbonImmutable;

/**
 * Starts and ends the journal sessions of agents; a child session names its parent. A session starts under the
 * agent's shared lifecycle lock, inside the launch's transaction, so a retired agent never gets one and a retirement
 * waiting for the lock sees the new session.
 */
final readonly class AgentSessions
{
    public function __construct(private AgentLifecycle $lifecycle, private BuiltInLaunchProfiles $builtInProfiles) {}

    /**
     * @throws LaunchRefused
     */
    public function start(
        Agent $agent,
        SelectedProgram $selection,
        string $requestId,
        AgentSession|null $parent = null,
    ): AgentSession {
        try {
            $this->lifecycle->lockShared($agent->id);
        } catch (AgentNotAvailable $retired) {
            throw LaunchRefused::forRetiredAgent($agent->id, $retired);
        }

        $session = new AgentSession();
        $session->startFor($agent, $parent, $this->pinned($agent, $selection), $requestId);
        $agent->adoptRuntime($session);

        return $session;
    }

    /**
     * The selection with its profile pin; a selection that names no profile is pinned to the agent's own profile.
     */
    private function pinned(Agent $agent, SelectedProgram $selection): SelectedProgram
    {
        return $this->builtInProfiles->pin($selection, $agent->profile_key);
    }

    public function end(AgentSession $session): void
    {
        $session->endAt(CarbonImmutable::now());
    }
}
