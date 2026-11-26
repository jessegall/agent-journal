<?php

declare(strict_types=1);

namespace App\Events\Asks;

use App\Asks\Contracts\AskHopEvent;
use App\Support\ActorReference;

/**
 * An ask was assigned to a holder as a new hop, at the ask's version. It names the ask, the hop and the holder.
 */
final readonly class AskHopAssigned implements AskEvent, AskHopEvent
{
    public function __construct(
        public string $askId,
        public string $hopId,
        public string $typeKey,
        public ActorReference $holder,
    ) {}
}
