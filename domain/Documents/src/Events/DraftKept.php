<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Events\Event;
use App\Support\ActorContext;

final readonly class DraftKept implements Event
{
    public function __construct(
        public string $draftId,
        public string $documentId,
        public ActorContext|null $parent,
    ) {}
}
