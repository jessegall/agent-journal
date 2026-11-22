<?php

declare(strict_types=1);

namespace App\Enums;

enum SupervisorCoverageType: string
{
    case Supported = 'supported';
    case Unsupported = 'unsupported';
    case Unknown = 'unknown';
}
