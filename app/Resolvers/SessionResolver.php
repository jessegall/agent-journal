<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Sessions\SessionResolver as SessionResolverContract;
use App\Enums\Sessions\SessionStatus;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Support\AgentInspection;
use App\Support\ReadBuilder;
use App\Support\SessionOption;
use App\Support\StartReceipt;
use App\Values\StackTarget;

/**
 * Reads the running sessions for the actor of this request, by the session's own activity rule: the user sees every
 * one, an agent only its own. Without an actor it refuses before reading anything.
 */
final readonly class SessionResolver implements SessionResolverContract
{
    /**
     * How many running sessions a choice offers; more running sessions than this is not a working setup.
     */
    public const int CHOICES_SHOWN = 50;

    public function __construct(private CurrentActor $actors, private AgentInspection $inspection) {}

    /**
     * The running sessions, oldest first: running is decided in the query, and the choice holds at most a page.
     *
     * @return list<SessionOption>
     */
    public function active(): array
    {
        return array_values($this->visibleSessions()->with(
            [
                'agent',
                'currentConversation',
            ],
        )->withCount('visits')->whereIn(
            'status',
            array_map(fn (SessionStatus $status) => $status->value, SessionStatus::running()),
        )
            ->orderBy('id')->limit(self::CHOICES_SHOWN)->get()
            ->map(fn (AgentSession $session) => self::optionOf($session))
            ->all());
    }

    public function requireActive(string $sessionId): StackTarget
    {
        $session = $this->visibleSessions()->with(
            [
                'agent',
                'currentConversation',
            ],
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
        $session = AgentSession::query()->whereKey($sessionId)->ofAgent($agentId)->lockForUpdate()->first();

        if ($session !== null && $session->isActive()) {
            return $session;
        }

        throw StackTargetRefused::forTarget(
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

        if ($this->inspection->seesEveryAgent()) {
            return $query;
        }

        return $query->where('agent_id', $actor->id);
    }

    private static function optionOf(AgentSession $session): SessionOption
    {
        return new SessionOption(
            $session->id,
            $session->agent->name,
            new StackTarget($session->agent_id, $session->id),
            $session->selection,
            StartReceipt::ACTUAL_MODEL_NOT_REPORTED,
            $session->currentConversation?->native_id,
            (int) $session->getAttribute('visits_count'),
        );
    }
}
