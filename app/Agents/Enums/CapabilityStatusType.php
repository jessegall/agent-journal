<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What the recorded evidence says about running a program with an account in an execution mode: proven, proven
 * impossible, or not proven either way. Only a proven combination may launch.
 */
enum CapabilityStatusType: string
{
    case Supported = 'supported';
    case Unsupported = 'unsupported';
    case Unverified = 'unverified';
}
