<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

/**
 * Whether a docked source shows its card to the caller now, or is out of reach.
 */
enum DockedStatus: string
{
    case Shown = 'shown';
    case Unavailable = 'unavailable';
}
