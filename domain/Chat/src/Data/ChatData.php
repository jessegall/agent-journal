<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Navigation\Data\Pages\SlotSectionData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The chat window: the agents the user can see, idle ones included, the one chosen (the main agent unless another
 * is), and the conversation with it. Without a designated main agent the installation still needs setting up.
 */
#[TypeScript]
final class ChatData extends Data
{
    /**
     * @param  list<AgentOptionData>  $agents
     * @param  list<ChatSummaryData>  $chats
     * @param  list<SlotSectionData>  $dockSections
     * @param  list<DriverChoiceData>  $drivers
     */
    public function __construct(
        #[DataCollectionOf(AgentOptionData::class)]
        public readonly array $agents,
        public readonly bool $isSetupRequired,
        public readonly string|Optional $mainAgentId = new Optional(),
        public readonly string|Optional $selectedAgentId = new Optional(),
        #[DataCollectionOf(SlotSectionData::class)]
        public readonly array $dockSections = [],
        public readonly ConversationData|Optional $conversation = new Optional(),
        // A setup problem the reader cannot fix here, such as a missing own inbox; it replaces the conversation.
        public readonly string|Optional $setupNotice = new Optional(),
        // The chats the viewer is in, for the inbox selector, and whether it may open a new one.
        #[DataCollectionOf(ChatSummaryData::class)]
        public readonly array $chats = [],
        public readonly bool $canCreateChats = false,
        // The registered drivers a start or switch form offers.
        #[DataCollectionOf(DriverChoiceData::class)]
        public readonly array $drivers = [],
        public readonly string|Optional $selectedInboxId = new Optional(),
    ) {}
}
