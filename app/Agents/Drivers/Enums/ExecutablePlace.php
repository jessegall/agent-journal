<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * Where a driver's executable is run from: as the host finds it, as the sealed copy a connected machine's installer made,
 * which the host opens by the name it was sealed under, or from the agent image a contained session runs in.
 */
enum ExecutablePlace: string
{
    case Host = 'host';
    case Sealed = 'sealed';
    case Image = 'image';
}
