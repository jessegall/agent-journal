<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A desk's seating moved on one generation.
 */
final readonly class DeskSeatingAdvanced extends WebEvent
{
    public function __construct(
        public string $deskId,
    ) {}
}
