<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\ArrangementType;
use App\Enums\ExecutionModeType;
use App\Values\DriverKey;
use App\Values\HostDescriptor;
use Spatie\LaravelData\Data;

/**
 * One driver registration a host advertises it runs: its key, the build it pins, the driver protocol it speaks, and
 * where it runs it.
 */
final class HostDescriptorData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $build,
        public readonly int $protocolVersion,
        public readonly ArrangementType $arrangement,
        public readonly ExecutionModeType $placement,
    ) {}

    public function descriptor(): HostDescriptor
    {
        return new HostDescriptor(
            DriverKey::from($this->key),
            $this->build,
            $this->protocolVersion,
            $this->arrangement,
            $this->placement,
        );
    }
}
