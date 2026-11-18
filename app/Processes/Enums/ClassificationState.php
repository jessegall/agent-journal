<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Whether a classification rule classifies commands with its active revision, or was retired by the owner.
 */
enum ClassificationState: string
{
    case Active = 'active';
    case Retired = 'retired';
}
