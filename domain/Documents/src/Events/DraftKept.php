<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Support\ActorIdentity;

final readonly class DraftKept implements DocumentEvent
{
    public function __construct(
        public string $draftId,
        public string $documentId,
        public ActorIdentity|null $parent,
    ) {}
}
