<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * The host's allow set that names a driver image went out, as this instruction.
 */
final readonly class DriverImageAllowSetSent implements DriverImageEvent
{
    public function __construct(
        public string $hostDriverImageId,
        public string $instructionId,
    ) {}
}
