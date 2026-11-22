<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a command may be dispatched from: the application's own transports, or one trusted entry of the journal
 * itself. A trusted entry's commands are reachable only through its own dispatcher.
 */
enum CommandEntry: string
{
    case Application = 'application';
    case HostControl = 'host_control';
    case ShareGateway = 'share_gateway';
    case SkillPublisher = 'skill_publisher';
    case EngineMaintenance = 'engine_maintenance';
    case AccountMaintenance = 'account_maintenance';
}
