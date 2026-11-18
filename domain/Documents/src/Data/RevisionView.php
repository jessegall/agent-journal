<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One past or current revision of a document with its whole text, marked historical when a later one exists.
 */
#[TypeScript]
final class RevisionView extends Data
{
    public function __construct(
        public readonly string $documentNumber,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $body,
        public readonly string $authorType,
        public readonly string $authorId,
        public readonly string $closedAt,
        public readonly bool $historical,
    ) {}
}
