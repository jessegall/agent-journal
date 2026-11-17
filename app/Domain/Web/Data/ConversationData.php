<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Chat\Conversation;
use App\Domain\Web\Data\Concerns\OptionalOrMissing;
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
    use OptionalOrMissing;

    /**
     * @param  list<MessageData>  $messages
     */
    public function __construct(
        public readonly string $id,
        public readonly string $sessionId,
        #[DataCollectionOf(MessageData::class)] public readonly array $messages,
    ) {}

    public static function fromConversation(Conversation $conversation): self
    {
        return self::from([
            'id' => $conversation->id(),
            'sessionId' => (string) $conversation->target->sessionId,
            'messages' => MessageData::collect($conversation->messages),
        ]);
    }
}
