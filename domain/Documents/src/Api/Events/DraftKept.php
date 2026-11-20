<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Actors\Support\ActorContext;
use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

final readonly class DraftKept implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $draftId,
        public string $documentId,
        public ActorContext|null $parent,
    ) {}
}
