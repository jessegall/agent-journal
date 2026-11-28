<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Web\Data\RunningCommandData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One chat as its window shows it: its members, what the viewer may do, the newest entries with whether older ones
 * exist, what is docked in it and the tool call its agent's line names.
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
        // The tool call the chat's agent runs or ran last, as its line above the composer; none before its first call.
        public readonly RunningCommandData|null $runningCommand,
    ) {}
}
