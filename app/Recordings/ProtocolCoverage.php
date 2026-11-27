<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\HostRoute;

/**
 * What of host protocol 1 no recording holds: the calls, the order types and the refusals still to record.
 */
final readonly class ProtocolCoverage
{
    /**
     * @param  list<HostRoute>  $routes
     * @param  list<HostOrderType>  $orderTypes
     * @param  list<HostRefusal>  $refusals
     */
    public function __construct(public array $routes, public array $orderTypes, public array $refusals) {}

    public function isWhole(): bool
    {
        return $this->routes === [] && $this->orderTypes === [] && $this->refusals === [];
    }
}
