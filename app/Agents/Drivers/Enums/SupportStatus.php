<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * Whether a driver can do an operation now: allowed, unavailable for the moment, or not something it does.
 */
enum SupportStatus: string
{
    case Allowed = 'allowed';
    case TemporarilyUnavailable = 'temporarily-unavailable';
    case Unsupported = 'unsupported';
}
