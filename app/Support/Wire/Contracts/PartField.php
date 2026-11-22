<?php

declare(strict_types=1);

namespace App\Support\Wire\Contracts;

use App\Support\Cards\Contracts\DockPart;
use App\Support\Wire\DestinationEncoder;

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
