<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Enums\SessionStatus;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\SessionOption;
use App\Agents\Support\StackTarget;
use App\Agents\Support\StartReceipt;
use App\Operations\Enums\AccessType;
use App\Reads\Support\ReadBuilder;

/**
 * Reads the running sessions for the actor of this request, by the session's own activity rule: the user sees every
 * one, an agent only its own. Without an actor it refuses before reading anything.
 */
final readonly class SessionRecords implements SessionResolver
{
    /**
     * How many running sessions a choice offers; more running sessions than this is not a working setup.
     */
    public const int CHOICES_SHOWN = 50;

    public function __construct(private CurrentActor $actors, private CurrentAuthorizer $authorizer) {}

    /**
     * The running sessions, oldest first: running is decided in the query, and the choice holds at most a page.
     *
     * @return list<SessionOption>
     */
    public function active(): array
    {
        return array_values($this->visibleSessions()->with(
            ['agent', 'currentConversation'],
        )->withCount('visits')->whereIn(
            'status',
            array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()),
        )
            ->orderBy('id')->readLimit(self::CHOICES_SHOWN)->get()
            ->map(fn (AgentSession $session) => self::optionOf($session))
            ->all());
    }

    public function requireActive(string $sessionId): StackTarget
    {
        $session = $this->visibleSessions()->with(
            ['agent', 'currentConversation'],
        )->withCount('visits')->find($sessionId);

        if ($session === null || ! $session->isActive()) {
            throw StackTargetRefused::forTarget("session {$sessionId}");
        }

        return self::optionOf($session)->target;
    }

    /**
     * The agent's session that may receive a message, locked so a session ending at the same time waits for the send;
     * only the validated row, no stack or records.
     *
     * @throws StackTargetRefused
     */
    public function lockEligibleSessionOf(string $agentId, string $sessionId): AgentSession
    {
        $session = AgentSession::query()->whereKey($sessionId)->where('agent_id', $agentId)->lockForUpdate()->first();

        return $session !== null && $session->canReceiveMessages() ? $session : throw StackTargetRefused::forTarget(
            "session {$sessionId}",
        );
    }

    /**
     * @return ReadBuilder<AgentSession>
     */
    private function visibleSessions(): ReadBuilder
    {
        $actor = $this->actors->actor();
        $query = AgentSession::query();

        return $this->inspectsAgents() ? $query : $query->where('agent_id', $actor->id);
    }

    private static function optionOf(AgentSession $session): SessionOption
    {
        return new SessionOption(
            $session->id,
            $session->agent->name,
            new StackTarget($session->agent_id, $session->id),
            $session->selection(),
            StartReceipt::ACTUAL_MODEL_NOT_REPORTED,
            $session->currentConversation?->native_id,
            (int) $session->getAttribute('visits_count'),
        );
    }

    /**
     * Whether the caller may see every agent's sessions and runtimes, not only its own.
     */
    private function inspectsAgents(): bool
    {
        return $this->authorizer->filterActions(AgentMaintenancePolicy::class, Agent::class, [AccessType::Read]) !== [];
    }
}
