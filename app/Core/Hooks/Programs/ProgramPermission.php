<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

/**
 * The only native permission decision the journal sends: a denial. It never grants a native approval.
 */
enum ProgramPermission: string
{
    case Deny = 'deny';
}
