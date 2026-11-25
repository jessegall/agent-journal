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
        public string $documentId,
        public int $documentNumber,
        public string $token,
        public int $version,
        public int $baseRevisionNumber,
        public array $outline,
    ) {}
}
