<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request was staged for its host.
 */
final readonly class DriverRequestStaged extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}
