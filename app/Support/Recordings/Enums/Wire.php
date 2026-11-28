<?php

declare(strict_types=1);

namespace App\Support\Recordings\Enums;

/**
 * A wire between the journal and the outside that a recording keeps the calls of: the host protocol, the hooks, the
 * agent calls, the Docker daemon, and each driver program's own exchange cut out of the host's.
 */
enum Wire: string
{
    case Host = 'host';
    case Hooks = 'hooks';
    case Agent = 'agent';
    case Docker = 'docker';
    case Driver = 'driver';
}
