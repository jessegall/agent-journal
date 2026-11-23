<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ArrangementType;
use App\Enums\ExecutionModeType;

/**
 * One driver registration a host advertises it runs, before it is matched against the journal's catalogue.
 */
final readonly class HostDescriptor
{
    public function __construct(
        public DriverKey $key,
        public string $build,
        public ArrangementType $arrangement,
        public ExecutionModeType $placement,
    ) {}
}
