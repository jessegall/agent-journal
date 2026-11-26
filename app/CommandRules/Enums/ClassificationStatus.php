<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

/**
 * Whether a classification rule classifies commands with its active revision, or was retired by the owner.
 */
enum ClassificationStatus: string
{
    case Active = 'active';
    case Retired = 'retired';
}
