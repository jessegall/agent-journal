<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A message as its chat entry shows it: its number in the inbox, its body, the message it answers, and whether the
 * viewer read it.
 */
#[TypeScript]
final class MessageEntryData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $number,
        public readonly string $body,
        public readonly string|null $targetMessageId,
        public readonly int|null $targetNumber,
        public readonly bool $isReadByViewer,
    ) {}
}
