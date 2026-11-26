<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Data;

/**
 * A call that failed on a host's own side, as the host reports it on its next answered call and the host row keeps
 * it: the route, the status it got (0 when nothing answered), the reason and when it first failed this way.
 */
final class FailedHostCallData extends Data
{
    public function __construct(
        public readonly string $route,
        public readonly int $status,
        public readonly string $reason,
        public readonly string $since,
    ) {}
}
