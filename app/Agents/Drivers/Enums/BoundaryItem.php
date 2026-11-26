<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * What a protected start keeps from the model's tools, each judged on its own in a protection report.
 */
enum BoundaryItem: string
{
    case AccountSecrets = 'account-secrets';
    case ForeignHistory = 'foreign-history';
    case Keychain = 'keychain';
    case ControlSockets = 'control-sockets';
    case ProcessInspection = 'process-inspection';
    case InstallWrites = 'install-writes';
}
