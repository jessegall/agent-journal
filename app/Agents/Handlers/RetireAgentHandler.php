<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\StartTokens;
use App\Agents\Commands\RetireAgent;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Agents\Lifecycle\AgentLifecycle;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverRequests;
use App\Agents\Values\StackTarget;
use App\Assignments\Contracts\AssignmentFactPublisher;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Operations\Enums\AccessType;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;

/**
 * Retires an agent for good: it ends its sessions and releases its assignments, under the agent's exclusive
 * lifecycle lock, inside the command's transaction.
 */
final readonly class RetireAgentHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private AgentLifecycle $lifecycle,
        private AgentSessions $sessions,
        private StartTokens $credentials,
        private AssignmentStorage $store,
        private AssignmentFactPublisher $facts,
        private DriverRequests $requests,
        private CommandFacts $commandFacts,
    ) {}

    public function handle(RetireAgent $command): AssignmentResult
    {
        // The exclusive lifecycle lock comes first, so a start of the same agent waits or is retried as a whole.
        $target = $this->lifecycle->lockExclusive($command->agentId);
        $caller = ActorIdentity::of($command->dispatchedBy());
        $this->assertRetirable($caller, $target);

        if ($target->isRetired()) {
            return new AssignmentResult([], []);
        }

        $target->retireAt(CarbonImmutable::now());
        $this->endSessionsOf($target);

        foreach ($this->cancelPendingOfAgent($target->id) as $account) {
            $this->commandFacts->publishAfterCommit(new AccountUseChanged($account));
        }

        $released = $this->store->releaseAll(AssigneeIdentity::of($target));
        $this->facts->publish($caller, AssignmentReason::Retired, $released);

        return $released;
    }

    /**
     * Nobody retires itself, whatever its grants; retiring another agent needs the grant, before anything ends.
     */
    private function assertRetirable(ActorIdentity $caller, Agent $target): void
    {
        if ($caller->isSameAs(ActorIdentity::of($target))) {
            throw AgentRetirementDenied::forCaller($caller, $target->id);
        }

        $this->authorizer->authorize(AgentPolicy::class, Agent::class, AccessType::Delete);
    }

    private function endSessionsOf(Agent $target): void
    {
        $sessions = AgentSession::query()
            ->where('agent_id', $target->id)
            ->with('startToken')
            ->readAll('every session of the retiring agent ends')
            ->get();

        // The session row before its credential, the order every other ending and a heartbeat take. A session with a
        // runtime is stopped through its host, which reports the exit that ends it.
        foreach ($sessions->filter(fn (AgentSession $session) => $session->isActive()) as $session) {
            if (AgentRuntime::isRunningForSession($session->id)) {
                $this->requests->stop(new StackTarget($target->id, $session->id), "retire-{$session->id}");
            }

            if (AgentRuntime::existsForSession($session->id)) {
                continue;
            }

            $this->sessions->end($session);

            if ($session->startToken !== null) {
                $this->credentials->revoke($session);
            }
        }
    }

    /**
     * Cancels the agent's starts no host has claimed yet, as its retirement does; a claimed start stays until its host
     * proves the process gone, since retiring the agent proves no exit.
     *
     * @return list<RecordIdentity>
     */
    private function cancelPendingOfAgent(string $agentId): array
    {
        $starts = ProcessStart::supervised()
            ->where('agent_id', $agentId)
            ->where('state', ProcessStartState::Pending->value)
            ->lockForUpdate()
            ->readAll('a retiring agent has few starts')
            ->get();

        $accounts = [];

        foreach ($starts as $start) {
            $start->cancelPending();
            $account = $start->accountIdentity();
            $accounts["{$account->type} {$account->id}"] = $account;
        }

        return array_values($accounts);
    }
}
