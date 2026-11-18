<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * How a host drives an agent program: one child per turn, or one persistent terminal.
 */
enum DriverType: string
{
    case Process = 'process';
    case Terminal = 'terminal';
}
