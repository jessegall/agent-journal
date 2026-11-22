<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\TimelineEvent;

/**
 * A chat envelope with the timeline event it is posted at, which is all a new chat message row is made of.
 */
final readonly class PlacedChatEnvelope
{
    public function __construct(
        public ChatEnvelope $envelope,
        public TimelineEvent $event,
    ) {}
}
