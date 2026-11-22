<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One chat at its own inbox, with an agent or among users only: who is viewing, who takes part, the newest page of its rows by speaker,
 * how far it has got and how much the viewer has not read, and the sources docked in it; its inbox id keys the
 * composer's draft.
 *
 * @method static static from(array<string, mixed> $conversation)
 */
#[TypeScript]
final class ConversationData extends Data
{
    /**
     * @param  list<ParticipantData>  $participants
     * @param  list<ChatMessageData>  $messages
     * @param  list<ChatLineData>  $lines
     */
    public function __construct(
        public readonly string $inboxId,
        public readonly string|null $agentId,
        public readonly string|null $sessionId,
        public readonly int $sessionGeneration,
        public readonly string $viewer,
        #[DataCollectionOf(ParticipantData::class)]
        public readonly array $participants,
        public readonly bool $canManageParticipants,
        public readonly ChatCapabilitiesData $capabilities,
        public readonly int $latestSequence,
        public readonly int $unreadCount,
        public readonly string|null $olderCursor,
        #[DataCollectionOf(ChatMessageData::class)]
        public readonly array $messages,
        #[DataCollectionOf(ChatLineData::class)]
        public readonly array $lines,
        public readonly DockPageData $dock,
    ) {}
}
