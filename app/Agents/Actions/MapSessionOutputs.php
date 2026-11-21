<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\ProgramConversation;
use App\Agents\Models\SessionOutputGrant;
use App\Agents\Models\StartRecord;
use App\Agents\Values\SessionOutputPaths;
use App\Programs\Enums\HookProgram;

/**
 * A step of recording a conversation visit, in the hook's transaction under the session's lock: the session's current
 * start begins a new mapping generation and its grants are replaced by the session's own earlier ones, those of the
 * session a Continue made it from when the same agent ran it, and the conversation the host just named when its
 * transcript lies in the start's account folder. A sibling's or a fork's parent history is never granted.
 */
final readonly class MapSessionOutputs
{
    public function map(
        AgentSession $session,
        ProgramConversation $conversation,
        ProcessStart $start,
        string|null $transcriptPath,
    ): void {
        $start->advanceOutputGeneration();
        $granted = SessionOutputGrant::heldBy($session->id) ?: $this->continuedFrom($session);
        $paths = $transcriptPath === null ? null : SessionOutputPaths::verified(
            HookProgram::from((string) $session->program),
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
        $predecessorId = StartRecord::query()->where('request_id', $session->start_request_id)->value(
            'context_reference',
        );
        $isSameAgent = is_string($predecessorId) && AgentSession::query()
            ->whereKey($predecessorId)
            ->where('agent_id', $session->agent_id)
            ->exists();

        return $isSameAgent ? SessionOutputGrant::heldBy($predecessorId) : [];
    }

    /**
     * Replaces every grant of the session with the given ones, under its start's newest mapping generation.
     *
     * @param  array<string, SessionOutputPaths>  $pathsByConversation
     */
    private function replaceFor(ProcessStart $start, array $pathsByConversation): void
    {
        SessionOutputGrant::query()->where('session_id', $start->session_id)->delete();

        $grants = [];

        foreach ($pathsByConversation as $conversationId => $paths) {
            $grants[] = SessionOutputGrant::unsaved($start, (string) $conversationId, $paths);
        }

        SessionOutputGrant::createAll($grants);
    }
}
