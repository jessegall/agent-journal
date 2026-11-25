<?php

declare(strict_types=1);

namespace App\Events\Web;

/**
 * A layout's name and shape were saved.
 */
final readonly class LayoutSaved implements WebEvent
{
    public function __construct(
        public string $layoutId,
    ) {}
}
