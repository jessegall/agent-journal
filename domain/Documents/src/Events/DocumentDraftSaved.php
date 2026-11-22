<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Events\Event;

/**
 * A draft was saved at a new version. It carries ids and the version, never the text.
 */
final readonly class DocumentDraftSaved implements Event
{
    public function __construct(public string $documentId, public int $version) {}
}
