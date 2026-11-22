<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A comment anchored to lines of the revision on screen: who wrote it, whom it was sent to when that is known, its
 * text, and, only when a delivery receipt says so, who has read it.
 */
#[TypeScript]
final class DocumentThreadData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly int $firstLine,
        public readonly int $lastLine,
        public readonly string $author,
        public readonly string $text,
        public readonly string|Optional $recipient = new Optional(),
        public readonly string|Optional $readBy = new Optional(),
    ) {}
}
