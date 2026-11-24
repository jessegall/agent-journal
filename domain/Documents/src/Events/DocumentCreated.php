<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorContext;

/**
 * A document was published with its first revision. It carries ids and the number, never the text.
 */
final readonly class DocumentCreated extends DocumentEvent implements UserInterfaceUpdater
{
    public function __construct(
        public string $documentId,
        public int $number,
        public ActorContext $actor,
    ) {}
}
