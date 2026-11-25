<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\ActorReference;

/**
 * A document was published with its first revision. It carries ids and the number, never the text.
 */
final readonly class DocumentCreated implements ClientUpdate, DocumentEvent
{
    public function __construct(
        public string $documentId,
        public int $number,
        public ActorReference $actor,
    ) {}
}
