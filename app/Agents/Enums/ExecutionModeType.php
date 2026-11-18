<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where a launched program runs: on the protected host, or entirely inside an admitted container.
 */
enum ExecutionModeType: string
{
    case ProtectedHost = 'protected_host';
    case RequiredContainer = 'required_container';
}
