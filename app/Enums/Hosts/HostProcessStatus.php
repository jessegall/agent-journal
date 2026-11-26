<?php

declare(strict_types=1);

namespace App\Enums\Hosts;

/**
 * Where a process on a host stands: ordered and not yet started, running, exited with proof, or lost.
 */
enum HostProcessStatus: string
{
    case Ordered = 'ordered';
    case Running = 'running';
    case Exited = 'exited';
    case Lost = 'lost';

    public function isLive(): bool
    {
        return match ($this) {
            self::Ordered, self::Running => true,
            self::Exited, self::Lost => false,
        };
    }
}
