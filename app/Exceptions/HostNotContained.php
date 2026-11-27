<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Something only a contained host has was asked of a host that runs its agents locally, such as its driver images.
 */
final class HostNotContained extends RuntimeException
{
    public static function forImages(string $hostId): self
    {
        return new self("The host {$hostId} runs its agents locally, so it builds no driver images.");
    }
}
