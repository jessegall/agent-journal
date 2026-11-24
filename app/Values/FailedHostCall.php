<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A call that failed on a host's own side, as the host reports it on its next answered call: the route, the status it
 * got (0 when nothing answered), the reason and when it first failed this way.
 */
final readonly class FailedHostCall
{
    public function __construct(
        public string $route,
        public int $status,
        public string $reason,
        public string $since,
    ) {}

    /**
     * @return array{route: string, status: int, reason: string, since: string}
     */
    public function toArray(): array
    {
        return ['route' => $this->route, 'status' => $this->status, 'reason' => $this->reason, 'since' => $this->since];
    }
}
