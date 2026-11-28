<?php

declare(strict_types=1);

namespace App\Agents\Commands\RetireAgent;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\DriverRequests;
use App\Agents\Enums\AccessType;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Assignments\Contracts\AssignmentFactPublisher;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Enums\AssignmentReason;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\AccountUseChanged;
use App\Inboxes\Contracts\InboxParticipationEnding;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Policies\AgentPolicy;
use App\Sessions\AgentSessions;
use App\Sessions\SessionTokens;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\Lifecycle\AgentLocks;
use App\Support\RecordIdentity;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;

/**
 * Retires an agent for good: it ends its sessions and releases its assignments, under the agent's exclusive
 * lifecycle lock, inside the command's transaction.
 */
final readonly class RetireAgentHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private AgentLocks $lifecycle,
        private AgentSessions $sessions,
        private SessionTokens $credentials,
        private AssignmentStorage $store,
        private AssignmentFactPublisher $facts,
        private DriverRequests $requests,
        private CommandFacts $commandFacts,
        private InboxParticipationEnding $inboxes,
    ) {}

    public function handle(RetireAgentCommand $command): AssignmentResult
    {
        // The exclusive lifecycle lock comes first, so a start of the same agent waits or is retried as a whole.
        $target = $this->lifecycle->lockExclusive($command->agentId);
        $caller = $command->dispatchedBy();
        $this->assertRetirable($caller, $target);

        if ($target->isRetired()) {
            return new AssignmentResult([], []);
        }

        $target->retireAt(CarbonImmutable::now());
        $this->endSessionsOf($target);
        // Under the lifecycle lock an enrollment of this agent either committed before and ends here, or is refused.
        $this->inboxes->endForRetirement(ActorReference::of($target));

        foreach ($this->cancelPendingOfAgent($target->id) as $account) {
            $this->commandFacts->publishAfterCommit(new AccountUseChanged($account));
        }

        $assignee = AssigneeIdentity::of($target);

        $released = $this->store->releaseAll($assignee);
        $this->facts->publish($caller, AssignmentReason::Retired, $released);

        return $released;
    }

    /**
     * Nobody retires itself, whatever its grants; retiring another agent needs the grant, before anything ends.
     */
    private function assertRetirable(ActorReference $caller, Agent $target): void
    {
        if ($caller->isSameAs(ActorReference::of($target))) {
            throw AgentRetirementDenied::forCaller($caller, $target->id);
        }

        $this->authorizer->authorize(AgentPolicy::class, Agent::class, AccessType::Delete);
    }

    private function endSessionsOf(Agent $target): void
    {
        $sessions = AgentSession::query()
            ->ofAgent($target->id)
            ->withSessionToken()
            ->get();

        // The session row before its credential, the order every other ending and a heartbeat take. A session with a
        // runtime is stopped through its host, which reports the exit that ends it.
        foreach ($sessions->filter(fn (AgentSession $session) => $session->isActive()) as $session) {
            if (AgentRuntime::isRunningForSession($session->id)) {
                $this->requests->stop(new StackTarget($target->id, $session->id), "retire-{$session->id}");
            }

            if (AgentRuntime::hasSession($session->id)) {
                continue;
            }

            $this->sessions->end($session);

            if ($session->sessionToken !== null) {
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
        $starts = SessionProcess::query()->supervised()
            ->ofAgents([$agentId])
            ->pending()
            ->lockForUpdate()
            ->get();

        $accounts = [];

        foreach ($starts as $start) {
            $start->cancelPending();
            $account = $start->accountIdentity;
            $accounts["{$account->type} {$account->id}"] = $account;
        }

        return array_values($accounts);
    }
}
