<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;
use App\Support\ActorContext;

/**
 * A document was published with its first revision. It carries ids and the number, never the text.
 */
final readonly class DocumentCreated implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $documentId,
        public int $number,
        public ActorContext $actor,
    ) {}
}
