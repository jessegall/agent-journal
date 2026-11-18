<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Domain\Chat\Api\MessageView;
use Domain\Chat\Enums\MessageState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One message in a conversation, its body exactly as sent.
 *
 * @method static static from(MessageView $message)
 */
#[TypeScript]
final class MessageData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $body,
        public readonly MessageState $state,
    ) {}

    public static function fromMessageView(MessageView $message): self
    {
        return new self(id: (string) $message->id, body: $message->body, state: $message->state);
    }
}
