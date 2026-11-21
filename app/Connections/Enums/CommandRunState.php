<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * Where one journal verb run for a connected machine stands.
 */
enum CommandRunState: string
{
    case Running = 'running';
    case Finished = 'finished';
    case Cancelled = 'cancelled';
}
