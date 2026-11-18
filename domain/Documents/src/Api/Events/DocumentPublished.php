<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A close published a new revision of a document. It carries ids and numbers, never the text.
 */
final readonly class DocumentPublished implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public string $documentId, public int $number, public int $revisionNumber) {}
}
