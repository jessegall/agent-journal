<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Contracts\BuiltInStartProfiles;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\SelectedProgram;
use Carbon\CarbonImmutable;
use Illuminate\Database\DatabaseManager;

/**
 * Starts and ends the journal sessions of agents; a child session names its parent. A session starts under the
 * agent's shared lifecycle lock, inside the start's transaction, so a retired agent never gets one and a retirement
 * waiting for the lock sees the new session; then under the agent's start reservation, which two starts never hold
 * together.
 */
final readonly class AgentSessions
{
    private const int START_RESERVATION_LOCKS = 7_304_211;

    public function __construct(
        private AgentLifecycle $lifecycle,
        private BuiltInStartProfiles $builtInProfiles,
        private DatabaseManager $databases,
    ) {}

    /**
     * Takes the agent's shared lifecycle lock for a start, the first lock every start takes, so a retirement waits
     * for it and a retired agent is refused; then the agent's exclusive start reservation until the commit, so a
     * competing start waits and sees this one's session.
     *
     * @throws StartRefused
     */
    public function lockForStart(Agent $agent): void
    {
        try {
            $this->lifecycle->lockShared($agent->id);
        } catch (AgentNotAvailable $retired) {
            throw StartRefused::forRetiredAgent($agent->id, $retired);
        }

        $this->databases->connection()->statement(
            'select pg_advisory_xact_lock(?, hashtext(?))',
            [self::START_RESERVATION_LOCKS, $agent->id],
        );
    }

    /**
     * Reserves the agent's next start and refuses it when the agent already runs a session.
     *
     * @throws StartRefused
     * @throws AgentBusy
     */
    public function reserveStart(Agent $agent): void
    {
        $this->lockForStart($agent);

        if (AgentSession::query()->runningFor($agent->id)->exists()) {
            throw AgentBusy::forAgent($agent->id);
        }
    }

    /**
     * @throws StartRefused
     */
    public function start(
        Agent $agent,
        SelectedProgram $selection,
        string $requestId,
        AgentSession|null $parent = null,
    ): AgentSession {
        $this->lockForStart($agent);

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
