<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageView;
use App\Records\Data\RecordCard;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The conversation with one session; its id keys the composer's draft.
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
        public readonly string $sessionId,
        public readonly string $sourceInboxId,
        public readonly string $destinationInboxId,
        #[DataCollectionOf(MessageView::class)]
        public readonly array $messages,
        #[DataCollectionOf(RecordCard::class)]
        public readonly array $dockedCards,
    ) {}

    /**
     * The messages between the person's inbox and the chosen agent's inbox, shown for the session the window has
     * chosen; the session is only the window's choice.
     *
     * @param  list<RecordCard>  $dockedCards
     */
    public static function fromPage(
        string $sourceInboxId,
        string $destinationInboxId,
        MessagePage $page,
        string $sessionId,
        array $dockedCards,
    ): self {
        return self::from([
            'id' => "{$sourceInboxId}-{$destinationInboxId}",
            'sessionId' => $sessionId,
            'sourceInboxId' => $sourceInboxId,
            'destinationInboxId' => $destinationInboxId,
            'messages' => $page->messages,
            'dockedCards' => $dockedCards,
        ]);
    }
}
