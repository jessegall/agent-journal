<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Contracts\ConversationVisits;
use App\Agents\Exceptions\ConversationIncompatible;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ConversationVisit;
use App\Agents\Models\LaunchRecord;
use App\Agents\Models\ProgramConversation;
use Carbon\CarbonImmutable;

/**
 * Records which native conversation a journal session is in, as a step inside the hook's stack transaction: under a
 * lock on the session row it finds or binds the conversation, appends the session's next visit once per event and
 * makes it the session's current one.
 */
final readonly class RecordConversationVisit implements ConversationVisits
{
    /**
     * The one settings store of a host until accounts name their own (plan 8 task 241).
     */
    public const string HOST_SETTINGS = 'host';

    /**
     * A program start, resume or clear entered a native conversation.
     *
     * @throws ConversationIncompatible
     */
    public function entered(string $sessionId, string $nativeId, string $eventId, CarbonImmutable $observedAt): void
    {
        $session = AgentSession::lockedForUpdate($sessionId);
        $context = LaunchRecord::query()->where('request_id', $session->launch_request_id)->value('context_reference');
        $conversation = ProgramConversation::query()->native((string) $session->program, self::HOST_SETTINGS, $nativeId)->first()
            ?? ProgramConversation::begin($session, self::HOST_SETTINGS, $nativeId, $context);

        if (! $conversation->admits($session->agent_id, $context)) {
            throw ConversationIncompatible::forSession($session->id);
        }

        ConversationVisit::appendOnce($session, $conversation, $eventId, $observedAt);
        $session->enterConversation($conversation);
    }

    /**
     * A compaction keeps the session in its current conversation and adds a visit to it; before any start it adds none.
     */
    public function compacted(string $sessionId, string $eventId, CarbonImmutable $observedAt): void
    {
        $session = AgentSession::lockedForUpdate($sessionId);
        $conversation = $session->current_conversation_id === null ? null : ProgramConversation::query()->find($session->current_conversation_id);

        if ($conversation !== null) {
            ConversationVisit::appendOnce($session, $conversation, $eventId, $observedAt);
        }
    }
}
