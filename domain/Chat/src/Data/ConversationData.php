<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Agents\Support\AgentOption;
use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageView;
use App\Docking\Data\SourceActionData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The conversation with one agent, with its live session when it has one and the sources docked in it; its id keys
 * the composer's draft.
 *
 * @method static static from(array<string, mixed> $conversation)
 */
#[TypeScript]
final class ConversationData extends Data
{
    /**
     * @param  list<MessageView>  $messages
     */
    public function __construct(
        public readonly string $id,
        public readonly string $agentId,
        public readonly string|null $sessionId,
        public readonly int $sessionGeneration,
        public readonly string $sourceInboxId,
        public readonly string $destinationInboxId,
        #[DataCollectionOf(MessageView::class)]
        public readonly array $messages,
        public readonly DockPageData $dock,
        public readonly SourceActionData|Optional $messageAction,
    ) {}

    /**
     * The messages between the user's inbox and the chosen agent's inbox, whether or not the agent runs a session,
     * and the first page of what is docked there.
     */
    public static function fromPage(
        string $sourceInboxId,
        string $destinationInboxId,
        MessagePage $page,
        AgentOption $agent,
        DockPageData $dock,
        SourceActionData|Optional $messageAction,
    ): self {
        return self::from([
            'id' => "{$sourceInboxId}-{$destinationInboxId}",
            'agentId' => $agent->agentId,
            'sessionId' => $agent->sessionId,
            'sessionGeneration' => $agent->sessionGeneration,
            'sourceInboxId' => $sourceInboxId,
            'destinationInboxId' => $destinationInboxId,
            'messages' => $page->messages,
            'dock' => $dock,
            'messageAction' => $messageAction,
        ]);
    }
}
