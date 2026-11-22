<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * A draft of a document was closed. It carries ids and numbers, never the text.
 */
final readonly class DocumentClosed implements Event, UserInterfaceUpdater
{
    public function __construct(public string $documentId, public int $number, public int $revisionNumber) {}
}
