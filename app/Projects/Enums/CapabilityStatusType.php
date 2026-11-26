<?php

declare(strict_types=1);

namespace App\Projects\Enums;

/**
 * What the recorded evidence says about running a driver with an account in an execution mode: proven, proven
 * impossible, or not proven either way. Only a proven combination may start.
 */
enum CapabilityStatusType: string
{
    case Supported = 'supported';
    case Unsupported = 'unsupported';
    case Unverified = 'unverified';
}
