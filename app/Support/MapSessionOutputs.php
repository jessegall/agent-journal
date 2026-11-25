<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverConversation;
use App\Models\Sessions\SessionOutputGrant;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Support\Drivers\Contracts\DriverAdapters;
use App\Values\SessionOutputPaths;

/**
 * A step of recording a conversation visit, in the hook's transaction under the session's lock: the session's current
 * start begins a new mapping generation and its grants are replaced by the session's own earlier ones, those of the
 * session a Continue made it from when the same agent ran it, and the conversation the host just named when its
 * transcript lies in the start's account folder. A sibling's or a fork's parent history is never granted.
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
