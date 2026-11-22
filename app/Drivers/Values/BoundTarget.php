<?php

declare(strict_types=1);

namespace App\Drivers\Values;

/**
 * The host a driver's support is asked for.
 */
final readonly class BoundTarget
{
    public function __construct(public string $hostId) {}
}
