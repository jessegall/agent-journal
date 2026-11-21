<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Agents\Support\AgentOption;
use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageView;
use App\Records\Data\RecordCard;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The conversation with one agent, with its live session when it has one; its id keys the composer's draft.
 *
 * @method static static from(array<string, mixed> $conversation)
 */
#[TypeScript]
final class ConversationData extends Data
{
    /**
     * @param  list<MessageView>  $messages
     * @param  list<RecordCard>  $dockedCards
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
        #[DataCollectionOf(RecordCard::class)]
        public readonly array $dockedCards,
    ) {}

    /**
     * The messages between the user's inbox and the chosen agent's inbox, whether or not the agent runs a session.
     *
     * @param  list<RecordCard>  $dockedCards
     */
    public static function fromPage(
        string $sourceInboxId,
        string $destinationInboxId,
        MessagePage $page,
        AgentOption $agent,
        array $dockedCards,
    ): self {
        return self::from([
            'id' => "{$sourceInboxId}-{$destinationInboxId}",
            'agentId' => $agent->agentId,
            'sessionId' => $agent->sessionId,
            'sessionGeneration' => $agent->sessionGeneration,
            'sourceInboxId' => $sourceInboxId,
            'destinationInboxId' => $destinationInboxId,
            'messages' => $page->messages,
            'dockedCards' => $dockedCards,
        ]);
    }
}
