<?php

declare(strict_types=1);

namespace App\Events\Links;

/**
 * A link between two records was removed.
 */
final readonly class LinkRemoved implements LinkEvent
{
    public function __construct(
        public string $linkId,
    ) {}
}
