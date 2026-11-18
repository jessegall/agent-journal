<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\LaunchCredentials;
use App\Agents\Commands\RetireAgent;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssignmentFacts;
use App\Assignments\Support\AssignmentResult;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

/**
 * Retires an agent for good: it ends its sessions and releases its assignments, under the agent's exclusive lifecycle lock,
 * inside the command's transaction.
 */
final readonly class RetireAgentHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private AgentLifecycle $lifecycle,
        private AgentSessions $sessions,
        private LaunchCredentials $credentials,
        private AssignmentStore $store,
        private AssignmentFacts $facts,
    ) {}

    public function handle(RetireAgent $command): AssignmentResult
    {
        // The exclusive lifecycle lock comes first, so a launch of the same agent waits or is retried as a whole.
        $target = $this->lifecycle->lockExclusive($command->agentId);
        $caller = ActorIdentity::of($this->actors->actor());
        $this->requireAuthority($caller, $target);

        if ($target->isRetired()) {
            return new AssignmentResult([], []);
        }

        $target->retireAt(CarbonImmutable::now());
        $this->endSessionsOf($target);
        $released = $this->store->releaseAll(ActorIdentity::of($target));
        $this->facts->publish($caller, AssignmentReason::Retired, $released);

        return $released;
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
        $sessions = AgentSession::query()->where('agent_id', $target->id)->with('credential')->readAll('every session of the retiring agent ends')->get();

        foreach ($sessions->filter(fn (AgentSession $session) => $session->isActive()) as $session) {
            if ($session->credential !== null) {
                $this->credentials->revoke($session);
            }

            $this->sessions->end($session);
        }
    }
}
