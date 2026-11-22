<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Enums\LineCardPlacement;
use App\Support\Wire\EncodedCard;
use App\Values\ChatLine;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\TypeScriptTransformer\References\CustomReference;

/**
 * A plain line the chat shows between its messages at its timeline position, such as a sequence's step starting, or
 * the card of a record it shows there, such as a long run with its state and time.
 */
#[TypeScript]
final class ChatLineData extends Data
{
    public function __construct(
        public readonly int $sequence,
        public readonly string $subject,
        public readonly string $line,
        public readonly string $postedAt,
        #[LiteralTypeScriptType(
            '%DockCardEnvelope% | null',
            references: ['DockCardEnvelope' => new CustomReference('docking', 'DockCardEnvelope')],
        )]
        public readonly EncodedCard|null $card,
        public readonly LineCardPlacement $cardPlacement,
    ) {}

    public static function fromChatLine(ChatLine $line, EncodedCard|null $card): self
    {
        return new self($line->sequence, $line->subject, $line->line, $line->postedAt->toIso8601String(), $card, $line->cardPlacement);
    }
}
