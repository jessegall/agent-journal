<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageOutcome;

/**
 * A host's driver image is refused for good: its build, history or start checks failed, or it could not be recovered
 * three times running.
 */
final readonly class DriverImageRefused implements DriverImageOutcome
{
    public function __construct(public string $hostDriverImageId) {}
}
