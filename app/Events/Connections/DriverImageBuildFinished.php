<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageEvent;

/**
 * A host's driver image was built; its runner must allow it before its checks run.
 */
final readonly class DriverImageBuildFinished implements DriverImageEvent
{
    public function __construct(
        public string $hostDriverImageId,
        public string $image,
    ) {}
}
