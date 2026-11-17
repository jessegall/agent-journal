<?php

declare(strict_types=1);

namespace App\Domain\Plans\Enums;

/**
 * What a plan is for, shown as the icon on its card.
 */
enum PlanKind: string
{
    case Build = 'build';
    case Fix = 'fix';
    case Research = 'research';
    case Cleanup = 'cleanup';
}
