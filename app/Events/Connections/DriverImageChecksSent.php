<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * A host's driver image was sent its start checks, as this instruction.
 */
final readonly class DriverImageChecksSent implements DriverImageEvent
{
    public function __construct(
        public string $hostDriverImageId,
        public string $instructionId,
    ) {}
}
