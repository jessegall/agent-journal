<?php

declare(strict_types=1);

namespace App\Supervision\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;

/**
 * An ask was assigned to a holder as a new hop, at the ask's version. It names the ask, the hop and the holder.
 */
final readonly class AskHopAssigned implements Event
{
    public function __construct(
        public string $askId,
        public string $hopId,
        public string $typeKey,
        public ActorIdentity $holder,
    ) {}
}
