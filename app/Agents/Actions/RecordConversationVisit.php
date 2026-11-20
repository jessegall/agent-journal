<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Contracts\ConversationVisits;
use App\Agents\Exceptions\ConversationIncompatible;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ConversationVisit;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\ProgramConversation;
use App\Agents\Models\StartRecord;
use Carbon\CarbonImmutable;

/**
 * Records which native conversation a journal session is in, as a step inside the hook's stack transaction: under a
 * lock on the session row it finds or binds the conversation in the settings store of the session's running start,
 * appends the session's next visit once per event, makes it the session's current one and maps the session's saved
 * outputs anew for that start.
 */
final readonly class RecordConversationVisit implements ConversationVisits
{
    /**
     * The settings store of a session the journal does not supervise: the host's own.
     */
    public const string HOST_SETTINGS = 'host';

    public function __construct(private MapSessionOutputs $outputs) {}

    /**
     * A program start, resume or clear entered a native conversation.
     *
     * @throws ConversationIncompatible
     */
    public function entered(
        string $sessionId,
        string $nativeId,
        string|null $transcriptPath,
        string $eventId,
        CarbonImmutable $observedAt,
    ): void {
        $session = AgentSession::lockedForUpdate($sessionId);
        $start = ProcessStart::lockedCurrentOf($session->id);
        $settings = $start === null ? self::HOST_SETTINGS : $start->settingsIdentity();
        $context = StartRecord::query()->where('request_id', $session->start_request_id)->value('context_reference');
        $conversation = ProgramConversation::query()->native((string) $session->program, $settings, $nativeId)->first()
            ?? ProgramConversation::create($session, $settings, $nativeId, $context);

        if (! $conversation->admits($session->agent_id, $context)) {
            throw ConversationIncompatible::forSession($session->id);
        }

        ConversationVisit::appendOnce($session, $conversation, $eventId, $observedAt);
        $session->enterConversation($conversation);
        StartRecord::confirmConversation($session->id, $nativeId);

        if ($start !== null) {
            $this->outputs->map($session, $conversation, $start, $transcriptPath);
        }
    }

    /**
     * A compaction keeps the session in its current conversation and adds a visit to it; before any start it adds none.
     */
    public function compacted(string $sessionId, string $eventId, CarbonImmutable $observedAt): void
    {
        $session = AgentSession::lockedForUpdate($sessionId);
        $conversation = $session->current_conversation_id === null ? null : ProgramConversation::query()->find(
            $session->current_conversation_id,
        );

        if ($conversation !== null) {
            ConversationVisit::appendOnce($session, $conversation, $eventId, $observedAt);
        }
    }
}
