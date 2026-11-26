<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * A driver request was settled as never applied.
 */
final readonly class DriverRequestResolvedAsNotApplied implements DriverRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
