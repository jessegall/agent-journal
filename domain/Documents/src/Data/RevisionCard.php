<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One revision of a document as its history lists it.
 */
#[TypeScript]
final class RevisionCard extends Data
{
    public function __construct(
        public readonly string $number,
        public readonly string $title,
        public readonly string $authorType,
        public readonly string $authorId,
        public readonly string $closedAt,
    ) {}
}
