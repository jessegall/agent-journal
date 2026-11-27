<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * The instruction a host's driver image waits on: its build, the allow set that names it, or its start checks.
 */
enum DriverImagePhase: string
{
    case Build = 'build';
    case Allow = 'allow';
    case Check = 'check';
}
