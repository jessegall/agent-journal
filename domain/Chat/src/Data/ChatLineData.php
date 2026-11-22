<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Values\ChatLine;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A plain line the chat shows between its messages at its timeline position, such as a sequence's step starting.
 *
 * @method static static from(array<string, mixed>|ChatLine $line)
 */
#[TypeScript]
final class ChatLineData extends Data
{
    public function __construct(
        public readonly int $sequence,
        public readonly string $subject,
        public readonly string $line,
        public readonly string $postedAt,
    ) {}

    public static function fromChatLine(ChatLine $line): self
    {
        return new self($line->sequence, $line->subject, $line->line, $line->postedAt->toIso8601String());
    }
}
