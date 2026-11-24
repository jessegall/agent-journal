<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request its host could not start yet was taken back, to be offered again later.
 */
final readonly class DriverRequestGivenBack extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}
