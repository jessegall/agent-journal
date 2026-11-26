<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * What a host says became of one of its processes.
 */
enum HostProcessReportType: string
{
    case Running = 'running';
    case Restarted = 'restarted';
    case Exited = 'exited';
    case Lost = 'lost';
}
