<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request was settled as never applied.
 */
final readonly class DriverRequestResolvedAsNotApplied extends SessionEvent implements DriverRequestEvent
{
    public function __construct(public string $requestId) {}
}
