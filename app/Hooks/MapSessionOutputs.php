<?php

declare(strict_types=1);

namespace App\Hooks;

use App\Agents\Drivers\Contracts\DriverAdapters;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverConversation;
use App\Models\Sessions\SessionOutputGrant;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Values\SessionOutputPaths;

/**
 * Maps a session's outputs for its current start in a new generation, under the session's lock: its grants become the
 * session's own earlier ones, those of the session a Continue made it from, and the conversation the host just named in
 * the start's account folder. A sibling's or fork's history is never granted.
 */
final readonly class MapSessionOutputs
{
    public function __construct(private DriverAdapters $adapters) {}

    public function map(
        AgentSession $session,
        DriverConversation $conversation,
        SessionProcess $start,
        string|null $transcriptPath,
    ): void {
        $start->advanceOutputGeneration();
        $granted = SessionOutputGrant::resolveHeldBy($session->id) ?: $this->continuedFrom($session);

        $paths = $transcriptPath === null ? null : SessionOutputPaths::verified(
            $this->adapters->for((string) $session->driver_key),
            $start->directory,
            $conversation->native_id,
            $transcriptPath,
        );

        if ($paths !== null) {
            $granted[$conversation->id] = $paths;
        }

        $this->replaceFor($start, $granted);
    }

    /**
     * The grants of the session this one continues, only when a Continue named it and the same agent ran it.
     *
     * @return array<string, SessionOutputPaths>
     */
    private function continuedFrom(AgentSession $session): array
    {
        $predecessorId = SessionRequest::query()->underRequest($session->start_request_id)->value(
            'context_reference',
        );

        $isSameAgent = is_string($predecessorId) && AgentSession::query()
            ->whereKey($predecessorId)
            ->ofAgent($session->agent_id)
            ->exists();

        if ($isSameAgent) {
            return SessionOutputGrant::resolveHeldBy($predecessorId);
        }

        return [];
    }

    /**
     * Replaces every grant of the session with the given ones, under its start's newest mapping generation.
     *
     * @param  array<string, SessionOutputPaths>  $pathsByConversation
     */
    private function replaceFor(SessionProcess $start, array $pathsByConversation): void
    {
        SessionOutputGrant::query()->ofSession($start->session_id)->delete();

        SessionOutputGrant::createMany($start, $pathsByConversation);
    }
}
