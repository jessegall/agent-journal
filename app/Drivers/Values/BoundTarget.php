<?php

declare(strict_types=1);

namespace App\Drivers\Values;

/**
 * The host a driver's support is asked for; a start asks before it is placed on a host, which names none.
 */
final readonly class BoundTarget
{
    private function __construct(public string|null $hostId) {}

    public static function onHost(string $hostId): self
    {
        return new self($hostId);
    }

    public static function beforePlacement(): self
    {
        return new self(null);
    }
}
