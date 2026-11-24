<?php

declare(strict_types=1);

namespace Domain\Documents\Values;

use App\Support\RecordReference;

/**
 * Which draft an edit changes: the document by number, the draft's token and the version the edit was made on.
 */
final readonly class DraftTarget
{
    public function __construct(
        public string $documentNumber,
        public string $token,
        public int|null $expectedVersion = null,
    ) {}

    /**
     * The document's id or number, as the document lookup takes it.
     */
    public function documentKey(): int|string
    {
        return RecordReference::idOrNumber($this->documentNumber);
    }
}
