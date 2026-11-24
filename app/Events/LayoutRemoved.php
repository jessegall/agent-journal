<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A layout was deleted by its user.
 */
final readonly class LayoutRemoved extends WebEvent
{
    public function __construct(
        public string $layoutId,
    ) {}
}
