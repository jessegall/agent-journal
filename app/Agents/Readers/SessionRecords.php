<?php

declare(strict_types=1);

namespace App\Agents\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\SessionReader;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\SessionOption;
use App\Agents\Support\StackTarget;
use Illuminate\Database\Eloquent\Builder;

/**
 * Reads the running sessions for the actor of this request, by the session's own activity rule: the user sees every
 * one, an agent only its own. Without an actor it refuses before reading anything.
 */
final readonly class SessionRecords implements SessionReader
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @return list<SessionOption>
     */
    public function active(): array
    {
        return array_values($this->visibleSessions()->with('agent')->orderBy('id')->get()
            ->filter(fn (AgentSession $session) => $session->isActive())
            ->map(fn (AgentSession $session) => self::optionOf($session))
            ->all());
    }

    public function requireActive(int $sessionId): StackTarget
    {
        $session = $this->visibleSessions()->with('agent')->find($sessionId);

        if ($session === null || ! $session->isActive()) {
            throw StackTargetRefused::forTarget("session {$sessionId}");
        }

        return self::optionOf($session)->target;
    }

    /**
     * @return Builder<AgentSession>
     */
    private function visibleSessions(): Builder
    {
        $actor = $this->actors->actor();
        $query = AgentSession::query();

        return $actor->isUser() ? $query : $query->where('agent_id', $actor->id);
    }

    private static function optionOf(AgentSession $session): SessionOption
    {
        return new SessionOption($session->id, $session->agent->name, new StackTarget($session->agent_id, $session->id));
    }
}
