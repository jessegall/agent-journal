<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Navigation\Contracts\ClientUpdate;
use App\Records\Contracts\RecordChanged;
use Domain\Documents\Support\DocumentType;

/**
 * A close published a new revision of a document. It carries ids and numbers, never the text.
 */
final readonly class DocumentPublished implements ClientUpdate, DocumentEvent, RecordChanged
{
    public function __construct(public string $documentId, public int $number, public int $revisionNumber) {}

    public function recordType(): string
    {
        return DocumentType::linkType();
    }

    public function recordId(): string
    {
        return $this->documentId;
    }
}
