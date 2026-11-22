<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\ExecutionModeType;
use App\Drivers\Values\DriverKey;

/**
 * One driver registration a host advertises it runs, before it is matched against the journal's catalogue.
 */
final readonly class HostDescriptor
{
    public function __construct(
        public DriverKey $key,
        public string $build,
        public int $protocolVersion,
        public ArrangementType $arrangement,
        public ExecutionModeType $placement,
    ) {}
}
