<?php

declare(strict_types=1);

namespace App\Sessions\Enums;

/**
 * How a start asked for its model: a model it names, or the default of its profile.
 */
enum ModelSelectionType: string
{
    case Named = 'named';
    case ProfileDefault = 'profile_default';
}
