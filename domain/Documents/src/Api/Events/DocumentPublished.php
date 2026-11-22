<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Contracts\Event;
use App\Docking\Sources\Contracts\DockSourceChanged;
use App\Ui\Contracts\UserInterfaceUpdater;
use Domain\Documents\Api\DocumentType;

/**
 * A close published a new revision of a document. It carries ids and numbers, never the text.
 */
final readonly class DocumentPublished implements
    DockSourceChanged,
    Event,
    UserInterfaceUpdater
{
    public function __construct(public string $documentId, public int $number, public int $revisionNumber) {}

    public function dockType(): string
    {
        return DocumentType::VALUE;
    }

    public function dockId(): string
    {
        return $this->documentId;
    }
}
