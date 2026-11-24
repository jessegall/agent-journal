<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * A document's draft was opened. It carries the document, never the text or the draft token.
 */
final readonly class DocumentOpened extends DocumentEvent implements UserInterfaceUpdater
{
    public function __construct(public string $documentId, public int $number) {}
}
