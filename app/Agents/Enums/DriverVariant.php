<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * How a host runs a driver: headless, one child per turn, or in one persistent terminal.
 */
enum DriverVariant: string
{
    case Headless = 'headless';
    case Terminal = 'terminal';
}
