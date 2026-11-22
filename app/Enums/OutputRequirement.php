<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How much of a part's output the journal must keep and read: tests, checks and builds need it whole.
 */
enum OutputRequirement: string
{
    case Full = 'full';
    case Ordinary = 'ordinary';
}
