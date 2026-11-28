<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

/**
 * A host's driver image came to its outcome, ready or refused, so the starts waiting on it go on or end.
 */
interface DriverImageOutcome extends DriverImageEvent
{
    public string $hostDriverImageId { get; }
}
