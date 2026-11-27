<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * A host's driver image is ready: built, allowed by the runner and checked, so the starts waiting on it go on.
 */
final readonly class DriverImageAdmitted implements DriverImageEvent
{
    public function __construct(public string $hostDriverImageId) {}
}
