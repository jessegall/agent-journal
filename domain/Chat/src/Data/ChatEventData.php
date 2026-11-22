<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Data\ChatEventView;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One event of a chat as the window reads it: its position, what happened, who did it as type:id and, for a message,
 * its id, which is also the handle the window acknowledges it with.
 */
#[TypeScript]
final class ChatEventData extends Data
{
    public function __construct(
        public readonly int $sequence,
        public readonly string $type,
        public readonly string $actor,
        public readonly string|null $messageId,
    ) {}

    public static function fromChatEventView(ChatEventView $event): self
    {
        return new self(
            $event->sequence,
            $event->type->value,
            "{$event->actor->type->value}:{$event->actor->id}",
            $event->messageId,
        );
    }
}
