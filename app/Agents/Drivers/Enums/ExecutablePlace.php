<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * Where a driver's driver is run from: as the host finds it, or as the sealed copy a connected machine's installer
 * made, which the host opens by the name it was sealed under and nothing else.
 */
enum ExecutablePlace: string
{
    case Host = 'host';
    case Sealed = 'sealed';
}
