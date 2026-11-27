<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use Spatie\LaravelData\Data;

/**
 * The draft of a document an agent holds: its token, version, base revision and outline.
 */
final class DraftHeld extends Data
{
    /**
     * @param  list<string>  $outline
     */
    public function __construct(
        public readonly string $documentId,
        public readonly int $documentNumber,
        public readonly string $token,
        public readonly int $version,
        public readonly int $baseRevisionNumber,
        public readonly array $outline,
    ) {}
}
