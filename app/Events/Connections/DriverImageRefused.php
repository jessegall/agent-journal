<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * A host's driver image is refused for good: its build, history or start checks failed, or it could not be recovered
 * three times running.
 */
final readonly class DriverImageRefused implements DriverImageEvent
{
    public function __construct(public string $hostDriverImageId) {}
}
