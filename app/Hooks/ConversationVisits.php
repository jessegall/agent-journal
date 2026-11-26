<?php

declare(strict_types=1);

namespace App\Hooks;

use App\Agents\Enums\ConversationModeType;
use App\Exceptions\ConversationIncompatible;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\ConversationVisit;
use App\Models\Drivers\DriverConversation;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Sessions\Contracts\ConversationVisits as ConversationVisitsContract;
use Carbon\CarbonImmutable;

/**
 * Records which native conversation a journal session is in, inside the hook's stack transaction: under the session's
 * lock it finds or binds the conversation of its running start, appends the next visit once per event, makes it current
 * and maps the session's outputs anew.
 */
final readonly class ConversationVisits implements ConversationVisitsContract
{
    /**
     * The settings store of a session the journal does not supervise: the host's own.
     */
    public const string HOST_SETTINGS = 'host';

    public function __construct(private MapSessionOutputs $outputs) {}

    /**
     * A driver start, resume or clear entered a native conversation.
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
        $session = AgentSession::findLockedForUpdate($sessionId);
        $start = SessionProcess::findLockedCurrentOf($session->id);
        $settings = $start === null ? self::HOST_SETTINGS : $start->settingsIdentity;
        $context = SessionRequest::query()->underRequest($session->start_request_id)->value('context_reference');

        $conversation = DriverConversation::query()->native(
            (string) $session->driver_key,
            $settings,
            $nativeId,
        )->first()
            ?? DriverConversation::create($session, $settings, $nativeId, $context);

        if (! $conversation->admits($session->agent_id, $context)) {
            throw ConversationIncompatible::forSession($session->id);
        }

        ConversationVisit::create($session, $conversation, $eventId, $observedAt);
        $session->enterConversation($conversation);
        $this->confirmConversation($session->id, $nativeId);

        if ($start !== null) {
            $this->outputs->map($session, $conversation, $start, $transcriptPath);
        }
    }

    /**
     * A compaction keeps the session in its current conversation and adds a visit to it; before any start it adds none.
     */
    public function compacted(string $sessionId, string $eventId, CarbonImmutable $observedAt): void
    {
        $session = AgentSession::findLockedForUpdate($sessionId);

        $conversation = $session->current_conversation_id === null ? null : DriverConversation::query()->find(
            $session->current_conversation_id,
        );

        if ($conversation !== null) {
            ConversationVisit::create($session, $conversation, $eventId, $observedAt);
        }
    }

    /**
     * Records whether the session went on in the conversation its start chose: a session that entered another one,
     * or a fresh one, never counts as resumed.
     */
    private function confirmConversation(string $sessionId, string $nativeId): void
    {
        $start = SessionRequest::query()->ofSession($sessionId)->resumeUnsettled()->first();

        if ($start === null || $start->conversation_mode !== ConversationModeType::Resume) {
            return;
        }

        $start->conversation_resumed = $start->conversation_target === $nativeId;
        $start->save();
    }
}
