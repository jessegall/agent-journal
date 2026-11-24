<?php

declare(strict_types=1);

namespace App\Events\Web;

/**
 * A user's preferred desk changed.
 */
final readonly class DeskPreferenceSwitched extends WebEvent
{
    public function __construct(
        public string $preferenceId,
    ) {}
}
