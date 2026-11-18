<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One revision of a document on its own page, read-only.
 */
#[TypeScript]
final class RevisionPageData extends Data
{
    public function __construct(
        public readonly string $documentNumber,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $bodyHtml,
        public readonly bool $historical,
    ) {}
}
