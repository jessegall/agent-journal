<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

/**
 * An open draft as its editor holds it: the document, an opaque token, the version to edit and the base revision.
 */
final readonly class DraftReference
{
    /**
     * @param  list<string>  $outline  each section as its number and heading
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
