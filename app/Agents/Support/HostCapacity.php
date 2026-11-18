<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * What the host gives all its helper containers together (config agents.host_capacity); launches reserve from it.
 */
final readonly class HostCapacity
{
    public function __construct(
        public int $cpuCores,
        public int $memoryBytes,
        public int $diskBytes,
    ) {}
}
