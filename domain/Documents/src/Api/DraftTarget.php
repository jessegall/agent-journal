<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

/**
 * Which draft an edit changes: the document by number, the draft's token and the version the edit was made on.
 */
final readonly class DraftTarget
{
    public function __construct(
        public int|string $documentNumber,
        public string $token,
        public int|null $expectedVersion = null,
    ) {}
}
