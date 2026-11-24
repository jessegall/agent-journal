<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A layout's name and shape were saved.
 */
final readonly class LayoutSaved extends WebEvent
{
    public function __construct(
        public string $layoutId,
    ) {}
}
