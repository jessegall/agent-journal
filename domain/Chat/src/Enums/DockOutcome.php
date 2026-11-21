<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

/**
 * What a dock or an undock came to: docked now, docked already, undocked, or nothing to act on.
 */
enum DockOutcome: string
{
    case Added = 'added';
    case Present = 'present';
    case Removed = 'removed';
    case Unavailable = 'unavailable';
}
