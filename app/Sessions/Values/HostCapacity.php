<?php

declare(strict_types=1);

namespace App\Sessions\Values;

/**
 * What the host gives all its helper containers together (config agents.host_capacity); starts reserve from it, and
 * are refused when they do not fit unless the owner switched the guard off.
 */
final readonly class HostCapacity
{
    public function __construct(
        public int $cpuCores,
        public int $memoryBytes,
        public int $diskBytes,
        public bool $isGuarded = true,
    ) {}
}
