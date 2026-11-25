<?php

declare(strict_types=1);

namespace App\Enums\Asks;

enum SupervisorCoverageType: string
{
    case Supported = 'supported';
    case Unsupported = 'unsupported';
    case Unknown = 'unknown';
}
