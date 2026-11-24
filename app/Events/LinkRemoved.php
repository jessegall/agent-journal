<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A link between two records was removed.
 */
final readonly class LinkRemoved extends LinkEvent
{
    public function __construct(
        public string $linkId,
    ) {}
}
