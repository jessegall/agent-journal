<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The editor's own open draft of a document, with its version and the revision it started from.
 */
#[TypeScript]
final class DraftView extends Data
{
    public function __construct(
        public readonly string $documentNumber,
        public readonly string $token,
        public readonly int $version,
        public readonly string $baseRevisionNumber,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $body,
    ) {}
}
