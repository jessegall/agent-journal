<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\AgentRetirement;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssignmentFacts;
use App\Assignments\Support\AssignmentResult;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;

/**
 * Retires an agent in its own read-committed transaction: it takes the agent's exclusive lifecycle lock first, so it
 * waits for work given and launches in progress, and every later statement then sees what they committed. It marks the
 * agent retired, ends its usable sessions with their credentials and releases every record it held, of every type,
 * without asking any owner. It never locks a record or another actor.
 */
final readonly class RetireAgent implements AgentRetirement
{
    public function __construct(
        private CurrentActor $actors,
        private AgentLifecycle $lifecycle,
        private AgentSessions $sessions,
        private LaunchCredentials $credentials,
        private AssignmentStore $store,
        private AssignmentFacts $facts,
        private ConnectionInterface $database,
    ) {}

    public function retire(int $agentId): AssignmentResult
    {
        $caller = ActorIdentity::of($this->actors->actor());

        if ($this->database->transactionLevel() > 0) {
            throw AgentRetirementDenied::insideTransaction();
        }

        return $this->database->transaction(function () use ($caller, $agentId): AssignmentResult {
            $this->database->statement('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            $target = $this->lifecycle->lockExclusive($agentId);
            $this->requireAuthority($caller, $target);

            if ($target->isRetired()) {
                return new AssignmentResult([], []);
            }

            $target->retireAt(CarbonImmutable::now());
            $this->endSessionsOf($target);
            $released = $this->store->releaseAll(ActorIdentity::of($target));
            $this->facts->publish($caller, AssignmentReason::Retired, $released);

            return $released;
        });
    }

    /**
     * The owner may retire any agent; a main agent that is not retired may retire an agent that is not a main agent.
     * The caller's own row is read, not locked.
     */
    private function requireAuthority(ActorIdentity $caller, Agent $target): void
    {
        if ($caller->type === ActorType::User) {
            return;
        }

        $callerAgent = Agent::query()->find($caller->id);

        if ($callerAgent === null || ! $callerAgent->isMainAgent() || $callerAgent->isRetired() || $target->isMainAgent()) {
            throw AgentRetirementDenied::forCaller($caller, $target->id);
        }
    }

    private function endSessionsOf(Agent $target): void
    {
        $sessions = AgentSession::query()->where('agent_id', $target->id)->with('credential')->get();

        foreach ($sessions->filter(fn (AgentSession $session) => $session->isActive()) as $session) {
            if ($session->credential !== null) {
                $this->credentials->revoke($session);
            }

            $this->sessions->end($session);
        }
    }
}
