<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * The only native permission decision the journal sends: a denial. It never grants a native approval.
 */
enum DriverPermission: string
{
    case Deny = 'deny';
}
