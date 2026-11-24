<?php

declare(strict_types=1);

namespace App\Events\Web;

/**
 * A desk was renamed.
 */
final readonly class DeskRenamed extends WebEvent
{
    public function __construct(
        public string $deskId,
        public string $label,
    ) {}
}
