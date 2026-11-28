<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\DriverImageOutcome;

/**
 * A host's driver image is ready: built, allowed by the runner and checked, so the starts waiting on it go on.
 */
final readonly class DriverImageAdmitted implements DriverImageOutcome
{
    public function __construct(public string $hostDriverImageId) {}
}
