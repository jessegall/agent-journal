<?php

declare(strict_types=1);

namespace App\Events\Web;

/**
 * A layout was deleted by its user.
 */
final readonly class LayoutRemoved implements WebEvent
{
    public function __construct(
        public string $layoutId,
    ) {}
}
