<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One comment as a record's comment list shows it: who wrote it and when, its text as the raw Markdown and as safe
 * HTML, and for an anchored comment the revision and quote it points at.
 */
#[TypeScript]
final class CommentCard extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $authorId,
        public readonly string $body,
        public readonly string $bodyHtml,
        public readonly string $createdAt,
        public readonly string|null $revision,
        public readonly string|null $quote,
    ) {}
}
