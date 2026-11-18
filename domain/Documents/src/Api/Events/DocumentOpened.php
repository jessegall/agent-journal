<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A document's draft was opened. It carries the document, never the text or the draft token.
 */
final readonly class DocumentOpened implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public string $documentId, public int $number) {}
}
