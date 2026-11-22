<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a start's mode came from: named for this start, the agent's saved choice, the profile's default, or the only
 * mode its driver family runs.
 */
enum ModeSourceType: string
{
    case Explicit = 'explicit';
    case Saved = 'saved';
    case Profile = 'profile';
    case OnlyMode = 'only_mode';
}
