<?php

declare(strict_types=1);

namespace App\Docking\Wire\Contracts;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Wire\DestinationEncoder;

/**
 * One field a part carries on the wire besides its type and key: its name, its TypeScript type and how its value is
 * written.
 */
interface PartField
{
    public function name(): string;

    public function typeScript(): string;

    public function encode(DockPart $part, DestinationEncoder $destinations): mixed;
}
