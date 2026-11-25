<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request its host could not start yet was taken back, to be offered again later.
 */
final readonly class DriverRequestGivenBack implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}
