<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One chat as its window shows it: its members, what the viewer may do, the newest entries with whether older ones
 * exist, what is docked in it and the agent's latest tool work since its last message.
 */
#[TypeScript]
final class ConversationData extends Data
{
    /**
     * @param  list<ParticipantData>  $participants
     * @param  list<ChatEntryData>  $entries
     */
    public function __construct(
        public readonly string $inboxId,
        public readonly string $label,
        public readonly string|null $agentId,
        public readonly string|null $sessionId,
        public readonly int $sessionGeneration,
        public readonly string $viewer,
        #[DataCollectionOf(ParticipantData::class)]
        public readonly array $participants,
        public readonly bool $canManageParticipants,
        public readonly ChatCapabilitiesData $capabilities,
        public readonly int $unreadCount,
        public readonly bool $hasOlder,
        #[DataCollectionOf(ChatEntryData::class)]
        public readonly array $entries,
        public readonly DockPageData $dock,
        // What the chat's agent read, ran or edited last, since its latest message here; none when it did nothing since.
        public readonly string|null $runningCommand,
    ) {}
}
