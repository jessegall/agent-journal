<?php

declare(strict_types=1);

namespace App\Projects\Enums;

/**
 * Where a container mount takes its files from: a folder of the machine, a named volume or a /srv/journal/ folder of
 * the agent daemon, or the plan's own files, which the host writes for the container. The values are the host's
 * (programs/agent/host/container.go, MountType).
 */
enum MountType: string
{
    case Bind = 'bind';
    case Volume = 'volume';
    case DaemonBind = 'daemon-bind';
    case PlanFile = 'plan-file';
}
