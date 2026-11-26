<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Support\Wire\EncodedCard;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\TypeScriptTransformer\References\CustomReference;

/**
 * One entry of a chat window: what it is, the group it is drawn in, who wrote it, and its source as that type shows
 * it. An event carries the card of the record it shows.
 */
#[TypeScript]
final class ChatEntryData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly ChatMessageType $type,
        public readonly int $groupNumber,
        public readonly string $author,
        public readonly string|null $authorLabel,
        public readonly string $createdAt,
        public readonly MessageEntryData|Optional $message = new Optional(),
        public readonly QuestionEntryData|Optional $question = new Optional(),
        #[LiteralTypeScriptType(
            '%DockCardEnvelope%',
            references: ['DockCardEnvelope' => new CustomReference('docking', 'DockCardEnvelope')],
        )]
        public readonly EncodedCard|Optional $event = new Optional(),
    ) {}
}
