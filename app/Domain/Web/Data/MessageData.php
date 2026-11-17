<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Chat\MessageState;
use App\Domain\Chat\Models\Message;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One message in a conversation, its body exactly as sent.
 *
 * @method static static from(Message $message)
 */
#[TypeScript]
final class MessageData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $body,
        public readonly MessageState $state,
    ) {}

    public static function fromMessage(Message $message): self
    {
        return new self(id: (string) $message->id, body: $message->body, state: $message->state);
    }
}
