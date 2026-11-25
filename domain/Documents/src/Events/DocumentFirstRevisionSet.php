<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

/**
 * A new document took its first revision.
 */
final readonly class DocumentFirstRevisionSet implements DocumentEvent
{
    public function __construct(public string $documentId, public string $revisionId) {}
}
