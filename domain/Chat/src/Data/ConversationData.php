<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Communication\Data\Conversation;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The conversation with one session; its id keys the composer's draft.
 *
 * @method static static from(Conversation|array<string, mixed> $conversation)
 */
#[TypeScript]
final class ConversationData extends Data
{
    /**
     * @param  list<MessageData>  $messages
     */
    public function __construct(
        public readonly string $id,
        public readonly string $sessionId,
        #[DataCollectionOf(MessageData::class)] public readonly array $messages,
    ) {}

    /**
     * The conversation shown for the session the window has chosen; the session is only the window's choice.
     */
    public static function fromConversation(Conversation $conversation, string $sessionId): self
    {
        return self::from([
            'id' => $conversation->id(),
            'sessionId' => $sessionId,
            'messages' => MessageData::collect($conversation->messages),
        ]);
    }
}
