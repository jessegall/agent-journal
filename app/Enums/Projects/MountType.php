<?php

declare(strict_types=1);

namespace App\Enums\Projects;

/**
 * Where a container mount takes its files from: a folder of the machine (the local arrangement), a named volume of
 * the agent daemon, or a folder under /srv/journal/ on the agent daemon. The values are the
 * journal-agent host's (tools/journal-agent/host/container.go, MountType).
 */
enum MountType: string
{
    case Bind = 'bind';
    case Volume = 'volume';
    case DaemonBind = 'daemon-bind';
}
